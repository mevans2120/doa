import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ContactFormEmail from '@/emails/ContactFormEmail'
import ContactFormAutoReply from '@/emails/ContactFormAutoReply'
import { client } from '../../../../sanity/lib/client'
import { emailSettingsQuery, siteSettingsQuery } from '../../../../sanity/lib/queries'
import { apiLogger as logger } from '@/lib/logger'

// Initialize Resend with API key (only if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Rate limiting: Store submission timestamps by IP
// In serverless, this resets on cold starts but that's acceptable for basic protection
const submissionTimestamps = new Map<string, number[]>()
const MAX_MAP_SIZE = 1000 // Prevent memory leaks by limiting map size

function cleanupOldEntries(): void {
  // Only clean if map is getting large
  if (submissionTimestamps.size > MAX_MAP_SIZE / 2) {
    const now = Date.now()
    const oneHourAgo = now - 3600000

    // Remove old entries
    for (const [ip, timestamps] of submissionTimestamps.entries()) {
      const recent = timestamps.filter(t => t > oneHourAgo)
      if (recent.length === 0) {
        submissionTimestamps.delete(ip)
      }
    }

    // If still too large, remove oldest entries
    if (submissionTimestamps.size > MAX_MAP_SIZE) {
      const entries = Array.from(submissionTimestamps.entries())
      entries.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]))
      // Keep only the most recent entries
      submissionTimestamps.clear()
      entries.slice(0, MAX_MAP_SIZE / 2).forEach(([ip, timestamps]) => {
        submissionTimestamps.set(ip, timestamps)
      })
    }
  }
}

function getRateLimitStatus(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const oneHourAgo = now - 3600000

  // Periodically clean up to prevent memory leaks
  cleanupOldEntries()

  // Get timestamps and clean old ones inline (no setInterval needed)
  const timestamps = submissionTimestamps.get(ip) || []
  const recentSubmissions = timestamps.filter(t => t > oneHourAgo)

  // Update with only recent timestamps
  if (recentSubmissions.length !== timestamps.length) {
    if (recentSubmissions.length === 0) {
      submissionTimestamps.delete(ip)
    } else {
      submissionTimestamps.set(ip, recentSubmissions)
    }
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
      logger.warn('Resend not configured - contact form submissions will not be sent via email')
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

    // Fetch email settings and site settings from CMS
    let emailSettings, siteSettings
    try {
      [emailSettings, siteSettings] = await Promise.all([
        client.fetch(emailSettingsQuery),
        client.fetch(siteSettingsQuery)
      ])
    } catch (error) {
      logger.error('Failed to fetch settings from CMS:', error)
    }

    // Get email addresses from environment variables only (removed from CMS)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@departmentofart.com'
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'info@departmentofart.com'
    const fromName = 'DOA Contact Form'

    // Render email HTML with CMS data and site settings
    const adminEmailHtml = await render(ContactFormEmail({ name, email, message, emailSettings, siteSettings }))
    const autoReplyHtml = await render(ContactFormAutoReply({ name, emailSettings, siteSettings }))

    // Send email to admin
    const subjectPrefix = emailSettings?.adminNotification?.subjectPrefix || 'New Contact Form Submission'
    const adminEmailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject: `${subjectPrefix} from ${name}`,
      replyTo: email,
      html: adminEmailHtml,
    })

    // Send auto-reply to user
    const autoReplySubject = emailSettings?.autoReply?.subject || 'Thank you for contacting Department of Art'
    const autoReplyResult = await resend.emails.send({
      from: `Department of Art <${fromEmail}>`,
      to: email,
      subject: autoReplySubject,
      html: autoReplyHtml,
    })

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
          autoReplyId: autoReplyResult.data?.id,
        }
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://doa-sable.vercel.app',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )

  } catch (error) {
    logger.error('Contact form submission error:', error)

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