import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ContactFormEmail from '@/emails/ContactFormEmail'
import ContactFormAutoReply from '@/emails/ContactFormAutoReply'

// Initialize Resend with API key (with fallback if not configured)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Simple rate limiting (ephemeral, resets on cold starts)
const submissionTimestamps = new Map<string, number[]>()

function getRateLimitStatus(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const oneHourAgo = now - 3600000

  const timestamps = submissionTimestamps.get(ip) || []
  const recentSubmissions = timestamps.filter(t => t > oneHourAgo)

  // Clean up inline
  if (recentSubmissions.length > 0) {
    submissionTimestamps.set(ip, recentSubmissions)
  } else {
    submissionTimestamps.delete(ip)
  }

  // Allow max 5 submissions per hour per IP
  if (recentSubmissions.length >= 5) {
    const oldestTimestamp = recentSubmissions[0]
    const retryAfter = Math.ceil((oldestTimestamp + 3600000 - now) / 1000)
    return { allowed: false, retryAfter }
  }

  return { allowed: true }
}

export async function POST(req: NextRequest) {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.log('Resend not configured, returning fallback response')
      return NextResponse.json(
        {
          success: true,
          message: 'Form submission received (email service not configured)',
          warning: 'Email notifications are currently disabled'
        },
        { status: 200 }
      )
    }

    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    const rateLimitStatus = getRateLimitStatus(ip)
    if (!rateLimitStatus.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitStatus.retryAfter)
          }
        }
      )
    }

    // Parse request body
    const body = await req.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate message length (max 5000 characters)
    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Get email addresses from environment variables
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'info@departmentofart.com'

    // Render email HTML
    const adminEmailHtml = await render(ContactFormEmail({ name, email, message }))
    const autoReplyHtml = await render(ContactFormAutoReply({ name }))

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: `DOA Contact Form <${fromEmail}>`,
      to: toEmail,
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: adminEmailHtml,
    })

    // Check if admin email failed
    if (adminEmailResult.error) {
      console.error('Admin email failed:', adminEmailResult.error)
      return NextResponse.json(
        { error: 'Failed to send notification email. Please try again.' },
        { status: 500 }
      )
    }

    // Send auto-reply to user (non-blocking - don't fail if this fails)
    const autoReplyResult = await resend.emails.send({
      from: `Department of Art <${fromEmail}>`,
      to: email,
      subject: 'Thank you for contacting Department of Art',
      html: autoReplyHtml,
    })

    if (autoReplyResult.error) {
      console.error('Auto-reply failed (non-blocking):', autoReplyResult.error)
    }

    // Record submission for rate limiting
    const timestamps = submissionTimestamps.get(ip) || []
    timestamps.push(Date.now())
    submissionTimestamps.set(ip, timestamps)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
        data: {
          adminEmailId: adminEmailResult.data?.id,
          autoReplyId: autoReplyResult.data?.id || null,
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form submission error:', error)

    // Check if it's a Resend API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Email service configuration error. Please try again later.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}