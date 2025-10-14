import { NextRequest, NextResponse } from 'next/server'

// Minimal test route to verify basic functionality
export async function POST(req: NextRequest) {
  console.log('[ContactTest] Request received')

  try {
    const body = await req.json()
    console.log('[ContactTest] Body parsed:', { name: body.name, email: body.email })

    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      received: body
    })
  } catch (error) {
    console.error('[ContactTest] Error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
