/**
 * Contact Form Email Testing Script
 * Tests email delivery with proper error checking
 */

const CONTACT_API = process.env.TEST_URL || 'http://localhost:3000/api/contact'

async function testContactForm() {
  console.log('Testing Contact Form Email Delivery...\n')

  // Test 1: Valid submission
  console.log('Test 1: Valid Submission')
  try {
    const response = await fetch(CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from the automated test script.',
      }),
    })

    const data = await response.json()
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (response.status === 200 && data.success) {
      console.log('✓ Test 1 PASSED: Email sent successfully')
      console.log('  Admin Email ID:', data.data.adminEmailId)
      console.log('  Auto-Reply ID:', data.data.autoReplyId)
    } else {
      console.log('✗ Test 1 FAILED:', data.error || 'Unknown error')
    }
  } catch (error) {
    console.log('✗ Test 1 FAILED:', error.message)
  }

  console.log('\n---\n')

  // Test 2: Invalid email
  console.log('Test 2: Invalid Email Format')
  try {
    const response = await fetch(CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'not-an-email',
        message: 'Test message',
      }),
    })

    const data = await response.json()

    if (response.status === 400 && data.error) {
      console.log('✓ Test 2 PASSED: Validation rejected invalid email')
    } else {
      console.log('✗ Test 2 FAILED: Should reject invalid email')
    }
  } catch (error) {
    console.log('✗ Test 2 FAILED:', error.message)
  }

  console.log('\n---\n')

  // Test 3: Missing fields
  console.log('Test 3: Missing Required Fields')
  try {
    const response = await fetch(CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        // Missing email and message
      }),
    })

    const data = await response.json()

    if (response.status === 400 && data.error) {
      console.log('✓ Test 3 PASSED: Validation rejected missing fields')
    } else {
      console.log('✗ Test 3 FAILED: Should reject missing fields')
    }
  } catch (error) {
    console.log('✗ Test 3 FAILED:', error.message)
  }

  console.log('\nTesting complete!')
  console.log('\nNext steps:')
  console.log('1. Check your email inbox for the test emails')
  console.log('2. Verify both admin notification and auto-reply were received')
  console.log('3. Check email formatting and content')
  console.log('4. Check dev server logs for [ContactForm:Info] entries')
}

testContactForm()
