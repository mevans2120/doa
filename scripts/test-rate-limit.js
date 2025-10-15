#!/usr/bin/env node
/**
 * Test script for contact form rate limiting
 * Tests that the serverless-compatible rate limiting works correctly
 */

const PORT = process.env.PORT || 3000
const API_URL = `http://localhost:${PORT}/api/contact`

async function testContactForm(testNumber) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.1' // Simulate same IP
      },
      body: JSON.stringify({
        name: `Test User ${testNumber}`,
        email: 'test@example.com',
        message: `Test message ${testNumber} - Testing rate limiting`
      })
    })

    const data = await response.json()

    console.log(`Test ${testNumber}:`, {
      status: response.status,
      statusText: response.statusText,
      retryAfter: response.headers.get('Retry-After'),
      data
    })

    return response.status
  } catch (error) {
    console.error(`Test ${testNumber} failed:`, error.message)
    return 500
  }
}

async function runTests() {
  console.log('Testing Contact Form Rate Limiting')
  console.log('===================================')
  console.log('This test will send 7 requests to verify rate limiting (max 5 per hour)')
  console.log('')

  const results = []

  // Send 7 requests in quick succession
  for (let i = 1; i <= 7; i++) {
    const status = await testContactForm(i)
    results.push({ test: i, status })

    // Small delay to avoid overwhelming
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n\nTest Results Summary:')
  console.log('=====================')

  const successful = results.filter(r => r.status === 200).length
  const rateLimited = results.filter(r => r.status === 429).length

  console.log(`✅ Successful: ${successful} (expected: 5)`)
  console.log(`🚫 Rate Limited: ${rateLimited} (expected: 2)`)

  if (successful === 5 && rateLimited === 2) {
    console.log('\n✨ Rate limiting is working correctly!')
  } else {
    console.log('\n⚠️ Rate limiting may not be working as expected')
  }
}

// Check if server is running
fetch(`http://localhost:${PORT}`)
  .then(() => {
    console.log(`Server is running on localhost:${PORT}\n`)
    runTests()
  })
  .catch(() => {
    console.error(`❌ Server is not running on localhost:${PORT}`)
    console.error('Please run "npm run dev" first')
    process.exit(1)
  })