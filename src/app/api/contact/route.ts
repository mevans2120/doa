import { NextRequest, NextResponse } from 'next/server'

// NO module-level initialization - everything happens inside the handler
console.log('[Contact] Module loaded - no initialization yet')

export async function POST(req: NextRequest) {
  console.log('[Contact] POST handler called')

  try {
    // Initialize Resend INSIDE the handler, not at module level
    console.log('[Contact] Step 1: Importing Resend')
    const { Resend } = await import('resend')

    console.log('[Contact] Step 2: Creating Resend instance')
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

    console.log('[Contact] Step 3: Checking Resend instance', { hasResend: !!resend })

    if (!resend) {
      return NextResponse.json(
        { error: 'Resend not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { name, email, message } = body

    console.log('[Contact] Step 4: Got request data', { name, email })

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    console.log('[Contact] Step 5: Validation passed')

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'info@departmentofart.com'

    console.log('[Contact] Step 6: Sending test email', { from: fromEmail, to: toEmail })

    // Send simple plain text email (no templates yet)
    const result = await resend.emails.send({
      from: `DOA Contact Form <${fromEmail}>`,
      to: toEmail,
      subject: `Contact form test from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    console.log('[Contact] Step 7: Email result', {
      success: !!result.data,
      hasError: !!result.error,
      emailId: result.data?.id
    })

    if (result.error) {
      console.error('[Contact] Email error:', result.error)
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      emailId: result.data?.id
    })

  } catch (error) {
    console.error('[Contact] Handler error:', error)
    return NextResponse.json(
      {
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
