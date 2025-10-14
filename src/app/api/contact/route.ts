import { NextRequest, NextResponse } from 'next/server'

console.log('[Contact] Step 1: Basic imports loaded')

// Try importing Resend
import { Resend } from 'resend'
console.log('[Contact] Step 2: Resend imported')

// Try importing render
import { render } from '@react-email/render'
console.log('[Contact] Step 3: React Email render imported')

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
console.log('[Contact] Step 4: Resend initialized, has key?', !!process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  console.log('[Contact] POST handler called')

  try {
    const body = await req.json()
    const { name, email, message } = body

    console.log('[Contact] Request received:', { name, email })

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, just return success without actually sending
    return NextResponse.json({
      success: true,
      message: 'Test: Would send email here',
      debug: {
        hasResend: !!resend,
        hasApiKey: !!process.env.RESEND_API_KEY,
      }
    })

  } catch (error) {
    console.error('[Contact] Error in POST handler:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
