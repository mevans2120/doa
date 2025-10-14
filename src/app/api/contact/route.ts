import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ContactFormEmail from '@/emails/ContactFormEmail'
import ContactFormAutoReply from '@/emails/ContactFormAutoReply'
import { client } from '../../../../sanity/lib/client'
import { emailSettingsQuery } from '../../../../sanity/lib/queries'

// Logging utility for contact form operations
function logContactFormEvent(
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString()
  const logData = {
    timestamp,
    level,
    message,
    ...data,
  }

  if (level === 'error') {
    console.error('[ContactForm:Error]', logData)
  } else if (level === 'warn') {
    console.warn('[ContactForm:Warning]', logData)
  } else {
    console.log('[ContactForm:Info]', logData)
  }

  // TODO: Send to external logging service (Sentry, LogRocket, etc.)
  // if (process.env.NODE_ENV === 'production') {
  //   // sendToLoggingService(logData)
  // }
}

// Sanitize email for logging (hide most of the local part)
function sanitizeEmailForLogging(email: string): string {
  return email.replace(/(?<=.{2}).*(?=@)/, '***')
}

// Initialize Resend with API key (only if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Rate limiting: Store submission timestamps by IP
const submissionTimestamps = new Map<string, number[]>()

// Clean up old timestamps every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000
  for (const [ip, timestamps] of submissionTimestamps.entries()) {
    const filtered = timestamps.filter(t => t > oneHourAgo)
    if (filtered.length === 0) {
      submissionTimestamps.delete(ip)
    } else {
      submissionTimestamps.set(ip, filtered)
    }
  }
}, 3600000)

function getRateLimitStatus(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const oneHourAgo = now - 3600000
  
  const timestamps = submissionTimestamps.get(ip) || []
  const recentSubmissions = timestamps.filter(t => t > oneHourAgo)
  
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
      const ip = req.headers.get('x-forwarded-for') ||
                 req.headers.get('x-real-ip') ||
                 'unknown'
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
    
    // Fetch email settings from CMS
    let emailSettings
    try {
      emailSettings = await client.fetch(emailSettingsQuery)
      logContactFormEvent('info', 'Email settings loaded from CMS')
    } catch (error) {
      logContactFormEvent('error', 'Failed to fetch email settings from CMS', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    // Get email addresses from CMS or fall back to environment variables
    const fromEmail = emailSettings?.adminNotification?.fromEmail || process.env.RESEND_FROM_EMAIL || 'contact@departmentofart.com'
    const toEmail = emailSettings?.adminNotification?.toEmail || process.env.CONTACT_FORM_TO_EMAIL || 'info@departmentofart.com'
    const fromName = emailSettings?.adminNotification?.fromName || 'DOA Contact Form'
    
    // Render email HTML with CMS data
    logContactFormEvent('info', 'Rendering email templates', {
      from: fromEmail,
      toAdmin: toEmail,
      toUser: sanitizeEmailForLogging(email)
    })
    const adminEmailHtml = await render(ContactFormEmail({ name, email, message, emailSettings }))
    const autoReplyHtml = await render(ContactFormAutoReply({ name, emailSettings }))

    // Send email to admin
    const subjectPrefix = emailSettings?.adminNotification?.subjectPrefix || 'New Contact Form Submission'
    const adminEmailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject: `${subjectPrefix} from ${name}`,
      replyTo: email,
      html: adminEmailHtml,
    })

    // Check for admin email errors (CRITICAL - must succeed)
    if (adminEmailResult.error) {
      logContactFormEvent('error', 'Failed to send admin notification email', {
        error: adminEmailResult.error,
        from: fromEmail,
        to: toEmail,
        formData: { name, email: sanitizeEmailForLogging(email) }
      })

      return NextResponse.json(
        {
          error: 'Failed to send notification email. Please try again or contact us directly.',
          details: process.env.NODE_ENV === 'development' ? adminEmailResult.error.message : undefined
        },
        { status: 500 }
      )
    }

    logContactFormEvent('info', 'Admin notification email sent successfully', {
      emailId: adminEmailResult.data?.id,
      to: toEmail
    })

    // Send auto-reply to user
    const autoReplySubject = emailSettings?.autoReply?.subject || 'Thank you for contacting Department of Art'
    const autoReplyResult = await resend.emails.send({
      from: `Department of Art <${fromEmail}>`,
      to: email,
      subject: autoReplySubject,
      html: autoReplyHtml,
    })

    // Check for auto-reply errors (NON-BLOCKING - don't fail if this fails)
    if (autoReplyResult.error) {
      logContactFormEvent('error', 'Failed to send auto-reply email (non-blocking)', {
        error: autoReplyResult.error,
        to: sanitizeEmailForLogging(email)
      })
      // Don't fail the request - admin email succeeded
    } else {
      logContactFormEvent('info', 'Auto-reply email sent successfully', {
        emailId: autoReplyResult.data?.id,
        to: sanitizeEmailForLogging(email)
      })
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
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown'

    logContactFormEvent('error', 'Contact form submission error', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error,
      ip,
    })

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

