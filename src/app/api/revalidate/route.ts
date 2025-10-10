import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Content type to routes mapping
const ROUTE_MAP: Record<string, string[]> = {
  project: ['/', '/projects'],
  service: ['/', '/services'],
  client: ['/', '/clients'],
  testimonial: ['/'],
  homepageSettings: ['/'],
  siteSettings: ['/', '/projects', '/services', '/clients', '/about', '/contact'],
  servicesPage: ['/services'],
  projectsPage: ['/projects'],
  aboutPage: ['/about'],
  contactPage: ['/contact'],
  teamMember: ['/about'],
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = request.headers.get('sanity-webhook-signature')
    const body = await request.text()

    if (!signature || !verifySignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // 2. Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (isRateLimited(ip)) {
      console.error('Rate limit exceeded for IP:', ip)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // 3. Parse webhook payload
    const payload = JSON.parse(body)
    const documentType = payload._type || payload.result?._type

    if (!documentType) {
      console.error('No document type in webhook payload')
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // 4. Get affected routes
    const routes = ROUTE_MAP[documentType] || []

    if (routes.length === 0) {
      console.warn(`No routes configured for document type: ${documentType}`)
      return NextResponse.json({
        success: true,
        message: `No routes to revalidate for ${documentType}`,
      })
    }

    // 5. Revalidate all affected routes
    const revalidated: string[] = []
    for (const route of routes) {
      try {
        revalidatePath(route)
        revalidated.push(route)
        console.log(`✓ Revalidated: ${route}`)
      } catch (error) {
        console.error(`✗ Failed to revalidate ${route}:`, error)
      }
    }

    // 6. Return success response
    return NextResponse.json({
      success: true,
      documentType,
      revalidated,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Verify HMAC signature from Sanity
function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not configured')
    return false
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return signature === hash
}

// Simple rate limiting (60 requests per 5 minutes per IP)
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + 5 * 60 * 1000, // 5 minutes
    })
    return false
  }

  if (limit.count >= 60) {
    return true
  }

  limit.count++
  return false
}
