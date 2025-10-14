import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'

// Logging utility
function logContactFormEvent(
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString()
  const logData = { timestamp, level, message, ...data }

  if (level === 'error') {
    console.error('[ContactForm:Error]', logData)
  } else if (level === 'warn') {
    console.warn('[ContactForm:Warning]', logData)
  } else {
    console.log('[ContactForm:Info]', logData)
  }
}

// Sanitize email for logging
function sanitizeEmailForLogging(email: string): string {
  return email.replace(/(?<=.{2}).*(?=@)/, '***')
}

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Simple rate limiting (ephemeral, resets on cold starts)
const submissionTimestamps = new Map<string, number[]>()

function getRateLimitStatus(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const oneHourAgo = now - 3600000
  const timestamps = submissionTimestamps.get(ip) || []
  const recentSubmissions = timestamps.filter(t => t > oneHourAgo)

  if (recentSubmissions.length > 0) {
    submissionTimestamps.set(ip, recentSubmissions)
  } else {
    submissionTimestamps.delete(ip)
  }

  if (recentSubmissions.length >= 5) {
    const oldestTimestamp = recentSubmissions[0]
    const retryAfter = Math.ceil((oldestTimestamp + 3600000 - now) / 1000)
    return { allowed: false, retryAfter }
  }

  return { allowed: true }
}

export async function POST(req: NextRequest) {
  try {
    if (!resend) {
      const ip = req.headers.get('x-forwarded-for') || 'unknown'
      logContactFormEvent('warn', 'Resend not configured', { ip })
      return NextResponse.json(
        {
          success: true,
          message: 'Form submission received (email service not configured)',
          warning: 'Email notifications are currently disabled'
        },
        { status: 200 }
      )
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Rate limiting
    const rateLimitStatus = getRateLimitStatus(ip)
    if (!rateLimitStatus.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitStatus.retryAfter) }
        }
      )
    }

    const body = await req.json()
    const { name, email, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long (max 5000 characters)' }, { status: 400 })
    }

    // Email configuration
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'info@departmentofart.com'
    const fromName = 'DOA Contact Form'

    logContactFormEvent('info', 'Sending emails', {
      from: fromEmail,
      toAdmin: toEmail,
      toUser: sanitizeEmailForLogging(email)
    })

    // Dynamically import email templates to avoid module-level crashes
    const { default: ContactFormEmail } = await import('../../../emails/ContactFormEmail')
    const { default: ContactFormAutoReply } = await import('../../../emails/ContactFormAutoReply')

    // Try to get CMS settings (non-blocking)
    let emailSettings
    try {
      const { client } = await import('../../../../sanity/lib/client')
      const { emailSettingsQuery } = await import('../../../../sanity/lib/queries')
      emailSettings = await client.fetch(emailSettingsQuery)
      logContactFormEvent('info', 'CMS settings loaded')
    } catch (error) {
      logContactFormEvent('warn', 'CMS settings failed to load, using defaults', {
        error: error instanceof Error ? error.message : 'Unknown'
      })
    }

    // Render emails
    const adminEmailHtml = await render(ContactFormEmail({ name, email, message, emailSettings }))
    const autoReplyHtml = await render(ContactFormAutoReply({ name, emailSettings }))

    // Send admin notification
    const subjectPrefix = emailSettings?.adminNotification?.subjectPrefix || 'New Contact Form Submission'
    const adminEmailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject: `${subjectPrefix} from ${name}`,
      replyTo: email,
      html: adminEmailHtml,
    })

    if (adminEmailResult.error) {
      logContactFormEvent('error', 'Admin email failed', {
        error: adminEmailResult.error,
        from: fromEmail,
        to: toEmail
      })
      return NextResponse.json(
        {
          error: 'Failed to send notification email. Please try again or contact us directly.',
          details: process.env.NODE_ENV === 'development' ? adminEmailResult.error.message : undefined
        },
        { status: 500 }
      )
    }

    logContactFormEvent('info', 'Admin email sent', {
      emailId: adminEmailResult.data?.id,
      to: toEmail
    })

    // Send auto-reply (non-blocking)
    const autoReplySubject = emailSettings?.autoReply?.subject || 'Thank you for contacting Department of Art'
    const autoReplyResult = await resend.emails.send({
      from: `Department of Art <${fromEmail}>`,
      to: email,
      subject: autoReplySubject,
      html: autoReplyHtml,
    })

    if (autoReplyResult.error) {
      logContactFormEvent('error', 'Auto-reply failed (non-blocking)', {
        error: autoReplyResult.error,
        to: sanitizeEmailForLogging(email)
      })
    } else {
      logContactFormEvent('info', 'Auto-reply sent', {
        emailId: autoReplyResult.data?.id,
        to: sanitizeEmailForLogging(email)
      })
    }

    // Record submission for rate limiting
    const timestamps = submissionTimestamps.get(ip) || []
    timestamps.push(Date.now())
    submissionTimestamps.set(ip, timestamps)

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
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    logContactFormEvent('error', 'Contact form error', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error,
      ip,
    })

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Email service configuration error. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
