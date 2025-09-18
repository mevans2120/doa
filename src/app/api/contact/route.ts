import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ContactFormEmail from '@/emails/ContactFormEmail'
import ContactFormAutoReply from '@/emails/ContactFormAutoReply'
import { client } from '../../../../sanity/lib/client'
import { emailSettingsQuery } from '../../../../sanity/lib/queries'

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
      console.log('Resend not configured - contact form submissions will not be sent via email')
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
    } catch (error) {
      console.error('Failed to fetch email settings from CMS:', error)
    }
    
    // Get email addresses from CMS or fall back to environment variables
    const fromEmail = emailSettings?.adminNotification?.fromEmail || process.env.RESEND_FROM_EMAIL || 'contact@departmentofart.com'
    const toEmail = emailSettings?.adminNotification?.toEmail || process.env.CONTACT_FORM_TO_EMAIL || 'info@departmentofart.com'
    const fromName = emailSettings?.adminNotification?.fromName || 'DOA Contact Form'
    
    // Render email HTML with CMS data
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