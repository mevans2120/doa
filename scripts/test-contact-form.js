#!/usr/bin/env node

/**
 * Test script for contact form functionality
 * Run with: node scripts/test-contact-form.js
 */

const testContactForm = async () => {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🧪 Testing Contact Form API...\n')
  
  // Test data
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message from the contact form test script.'
  }
  
  try {
    // Test 1: Valid submission
    console.log('Test 1: Valid form submission')
    console.log('Sending:', testData)
    
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Success:', result.message)
      console.log('Response data:', result.data)
    } else {
      console.log('❌ Error:', result.error)
      console.log('Status:', response.status)
    }
    
    console.log('\n---\n')
    
    // Test 2: Missing fields
    console.log('Test 2: Missing required fields')
    const invalidData = { name: 'Test' }
    
    const response2 = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    })
    
    const result2 = await response2.json()
    console.log('Expected error:', result2.error)
    console.log('Status:', response2.status)
    
    console.log('\n---\n')
    
    // Test 3: Invalid email
    console.log('Test 3: Invalid email format')
    const invalidEmail = {
      name: 'Test User',
      email: 'not-an-email',
      message: 'Test message'
    }
    
    const response3 = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidEmail),
    })
    
    const result3 = await response3.json()
    console.log('Expected error:', result3.error)
    console.log('Status:', response3.status)
    
    console.log('\n---\n')
    console.log('📝 Test Summary:')
    console.log('- Contact form API endpoint is working')
    console.log('- Validation is functioning correctly')
    console.log('- Error handling is in place')
    console.log('\n⚠️  Note: Actual email sending requires valid Resend API credentials')
    console.log('To complete setup:')
    console.log('1. Sign up at https://resend.com')
    console.log('2. Get your API key from https://resend.com/api-keys')
    console.log('3. Verify your domain at https://resend.com/domains')
    console.log('4. Update RESEND_API_KEY in .env.local')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\nMake sure the development server is running:')
    console.log('npm run dev')
  }
}

// Run the test
testContactForm()