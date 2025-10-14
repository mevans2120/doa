# Contact Form Email Functionality - Implementation Fix Plan

## Executive Summary

**Problem**: Contact form submissions appear successful to users but emails are never sent. Investigation revealed two critical issues: (1) API route doesn't check Resend API responses for errors, and (2) Resend is in test mode with invalid configuration.

**Solution**: Fix error handling in API route, configure Resend with production credentials, add comprehensive logging, and implement monitoring.

**Impact**: HIGH - Business owner not receiving leads, users not receiving confirmations.

**Estimated Total Time**: 4-6 hours

**Priority**: CRITICAL - Fix immediately

---

## Issues Identified

### CRITICAL Issues

1. **Code Bug - No Error Handling** (Lines 127-167 in route.ts)
   - Status: CRITICAL
   - Impact: Silent failures - users see success but no emails sent
   - Location: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
   - Root Cause: Code doesn't check if `adminEmailResult` or `autoReplyResult` contain errors

2. **Resend Configuration** (Production Setup Required)
   - Status: CRITICAL
   - Impact: Emails cannot be sent in production
   - Current State: Test mode with `onboarding@resend.dev`
   - Required: Domain verification for `departmentofart.com`

### HIGH Priority Issues

3. **Missing Error Logging**
   - Status: HIGH
   - Impact: Cannot diagnose email failures
   - Current State: Only catches exceptions, not API failures

4. **No Test Coverage**
   - Status: HIGH
   - Impact: Cannot verify fixes work
   - Current State: No tests exist for `/api/contact` route

### MEDIUM Priority Issues

5. **No Email Monitoring**
   - Status: MEDIUM
   - Impact: No alerts when emails fail
   - Current State: No tracking or alerting system

---

## Implementation Steps

## Phase 1: CRITICAL FIXES (Must Do First)

### Task 1.1: Fix Error Handling in API Route
**Priority**: CRITICAL
**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
**Estimated Time**: 45 minutes

#### Changes Required

**Location**: Lines 127-167 (email sending section)

**Current Code** (BROKEN):
```typescript
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
```

**New Code** (FIXED):
```typescript
// Send email to admin
const subjectPrefix = emailSettings?.adminNotification?.subjectPrefix || 'New Contact Form Submission'
const adminEmailResult = await resend.emails.send({
  from: `${fromName} <${fromEmail}>`,
  to: toEmail,
  subject: `${subjectPrefix} from ${name}`,
  replyTo: email,
  html: adminEmailHtml,
})

// Check for admin email errors
if (adminEmailResult.error) {
  console.error('Failed to send admin notification email:', {
    error: adminEmailResult.error,
    from: fromEmail,
    to: toEmail,
    timestamp: new Date().toISOString(),
    formData: { name, email: email.replace(/(?<=.{2}).*(?=@)/, '***') } // Sanitize for logs
  })

  return NextResponse.json(
    {
      error: 'Failed to send notification email. Please try again or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? adminEmailResult.error.message : undefined
    },
    { status: 500 }
  )
}

console.log('Admin notification email sent successfully:', {
  emailId: adminEmailResult.data?.id,
  to: toEmail,
  timestamp: new Date().toISOString()
})

// Send auto-reply to user
const autoReplySubject = emailSettings?.autoReply?.subject || 'Thank you for contacting Department of Art'
const autoReplyResult = await resend.emails.send({
  from: `Department of Art <${fromEmail}>`,
  to: email,
  subject: autoReplySubject,
  html: autoReplyHtml,
})

// Check for auto-reply errors (non-blocking)
if (autoReplyResult.error) {
  console.error('Failed to send auto-reply email (non-blocking):', {
    error: autoReplyResult.error,
    to: email,
    timestamp: new Date().toISOString()
  })
  // Don't fail the request - admin email succeeded
} else {
  console.log('Auto-reply email sent successfully:', {
    emailId: autoReplyResult.data?.id,
    to: email,
    timestamp: new Date().toISOString()
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
```

#### Implementation Steps:
1. [ ] Open `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
2. [ ] Locate lines 127-167 (email sending section)
3. [ ] Add error checking after `adminEmailResult` assignment
4. [ ] Add detailed logging for both success and failure cases
5. [ ] Add error checking for `autoReplyResult` (non-blocking)
6. [ ] Ensure auto-reply failure doesn't block admin notification
7. [ ] Update return statement to include null handling for autoReplyId
8. [ ] Save file

#### Verification:
- [ ] Code compiles without TypeScript errors
- [ ] Admin email failure returns 500 status
- [ ] Auto-reply failure doesn't block admin email
- [ ] Console logs include timestamps and sanitized data

---

### Task 1.2: Configure Resend for Production
**Priority**: CRITICAL
**Estimated Time**: 60 minutes (includes DNS propagation wait time)

#### Resend Dashboard Setup

1. **Create/Access Production Resend Account**
   - [ ] Go to https://resend.com
   - [ ] Log in or create account with production email
   - [ ] Navigate to API Keys section

2. **Generate Production API Key**
   - [ ] Go to https://resend.com/api-keys
   - [ ] Click "Create API Key"
   - [ ] Name: "DOA Website Production"
   - [ ] Permission: "Sending access"
   - [ ] Click "Add"
   - [ ] Copy API key (starts with `re_`)
   - [ ] Save securely (it won't be shown again)

3. **Verify Domain**
   - [ ] Go to https://resend.com/domains
   - [ ] Click "Add Domain"
   - [ ] Enter: `departmentofart.com`
   - [ ] Copy DNS records provided by Resend

4. **Configure DNS Records**

   Navigate to your DNS provider (likely where departmentofart.com is hosted) and add these records:

   ```
   Type: TXT
   Name: resend._domainkey.departmentofart.com
   Value: [Value provided by Resend]
   TTL: 3600

   Type: TXT
   Name: departmentofart.com
   Value: [SPF record provided by Resend]
   TTL: 3600
   ```

   - [ ] Add TXT record for DKIM
   - [ ] Add TXT record for SPF
   - [ ] Wait 5-10 minutes for DNS propagation
   - [ ] Return to Resend dashboard and click "Verify"
   - [ ] Confirm domain shows "Verified" status

#### Update Environment Variables

**Development (.env.local)**:
```env
# Resend Configuration
RESEND_API_KEY=re_[YOUR_PRODUCTION_API_KEY]
RESEND_FROM_EMAIL=contact@departmentofart.com
CONTACT_FORM_TO_EMAIL=mevans212@gmail.com
```

**Production (Vercel Dashboard)**:
1. [ ] Go to https://vercel.com/dashboard
2. [ ] Select DOA website project
3. [ ] Navigate to Settings > Environment Variables
4. [ ] Update/Add these variables:
   - `RESEND_API_KEY`: `re_[YOUR_PRODUCTION_API_KEY]`
   - `RESEND_FROM_EMAIL`: `contact@departmentofart.com`
   - `CONTACT_FORM_TO_EMAIL`: `mevans212@gmail.com`
5. [ ] Save changes
6. [ ] Trigger new deployment or wait for next deploy

#### Verification:
- [ ] Domain verified in Resend dashboard
- [ ] Can send test email from Resend dashboard
- [ ] Environment variables updated locally
- [ ] Environment variables updated in Vercel
- [ ] DNS records propagated (check with `dig TXT resend._domainkey.departmentofart.com`)

---

## Phase 2: HIGH PRIORITY FIXES (Do Next)

### Task 2.1: Add Comprehensive Error Logging
**Priority**: HIGH
**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
**Estimated Time**: 30 minutes

#### Add Logging Utility Function

**Location**: Add at top of file after imports (around line 8)

```typescript
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
```

#### Add Logging Throughout Route

Update existing console.log/error calls to use the new utility:

**Lines 49-50** - Replace:
```typescript
console.log('Resend not configured - contact form submissions will not be sent via email')
```

With:
```typescript
logContactFormEvent('warn', 'Resend not configured', { ip })
```

**Lines 113-114** - Replace:
```typescript
console.error('Failed to fetch email settings from CMS:', error)
```

With:
```typescript
logContactFormEvent('error', 'Failed to fetch email settings from CMS', {
  error: error instanceof Error ? error.message : 'Unknown error'
})
```

**Line 170** - Replace:
```typescript
console.error('Contact form submission error:', error)
```

With:
```typescript
logContactFormEvent('error', 'Contact form submission error', {
  error: error instanceof Error ? {
    message: error.message,
    stack: error.stack,
  } : error,
  ip,
})
```

#### Implementation Steps:
1. [ ] Add logging utility function at top of file
2. [ ] Replace all console.log calls with logContactFormEvent
3. [ ] Replace all console.error calls with logContactFormEvent
4. [ ] Add info logging for successful submissions
5. [ ] Add logging for rate limit hits
6. [ ] Add TODO comments for future external logging integration
7. [ ] Save file

#### Verification:
- [ ] All logs prefixed with `[ContactForm:Level]`
- [ ] Logs include timestamps
- [ ] Error logs include stack traces
- [ ] Logs don't expose sensitive data (sanitize emails, API keys)

---

### Task 2.2: Add API Route Tests
**Priority**: HIGH
**File**: Create `/Users/michaelevans/DOA/doa-website/src/app/api/contact/__tests__/route.test.ts`
**Estimated Time**: 90 minutes

#### Create Test File

```typescript
import { NextRequest } from 'next/server'
import { POST } from '../route'
import { Resend } from 'resend'

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  }
})

// Mock Sanity client
jest.mock('../../../../../sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}))

// Mock React Email render
jest.mock('@react-email/render', () => ({
  render: jest.fn().mockResolvedValue('<html>Test Email</html>'),
}))

describe('/api/contact', () => {
  let mockResendSend: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test_key_123'
    process.env.RESEND_FROM_EMAIL = 'contact@departmentofart.com'
    process.env.CONTACT_FORM_TO_EMAIL = 'admin@departmentofart.com'

    // Get mock send function
    const ResendMock = Resend as jest.MockedClass<typeof Resend>
    const resendInstance = new ResendMock()
    mockResendSend = resendInstance.emails.send as jest.Mock
  })

  afterEach(() => {
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    delete process.env.CONTACT_FORM_TO_EMAIL
  })

  describe('Success Cases', () => {
    it('should send emails successfully with valid data', async () => {
      // Mock successful email sends
      mockResendSend
        .mockResolvedValueOnce({
          data: { id: 'admin-email-123' },
          error: null
        })
        .mockResolvedValueOnce({
          data: { id: 'autoreply-email-456' },
          error: null
        })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.adminEmailId).toBe('admin-email-123')
      expect(data.data.autoReplyId).toBe('autoreply-email-456')
      expect(mockResendSend).toHaveBeenCalledTimes(2)
    })

    it('should succeed even if auto-reply fails (non-blocking)', async () => {
      // Admin email succeeds, auto-reply fails
      mockResendSend
        .mockResolvedValueOnce({
          data: { id: 'admin-email-123' },
          error: null
        })
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Auto-reply failed', name: 'EmailError' }
        })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.adminEmailId).toBe('admin-email-123')
      expect(data.data.autoReplyId).toBeNull()
    })
  })

  describe('Error Cases', () => {
    it('should fail if admin email fails', async () => {
      // Mock admin email failure
      mockResendSend.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Invalid API key',
          name: 'AuthenticationError'
        }
      })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBeUndefined()
      expect(data.error).toBeDefined()
      expect(mockResendSend).toHaveBeenCalledTimes(1)
    })

    it('should return 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          // missing email and message
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'not-an-email',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email address')
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('should return 400 for message too long', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'a'.repeat(5001), // Over 5000 character limit
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Message is too long (max 5000 characters)')
      expect(mockResendSend).not.toHaveBeenCalled()
    })
  })

  describe('Rate Limiting', () => {
    it('should block requests after 5 submissions from same IP', async () => {
      mockResendSend.mockResolvedValue({
        data: { id: 'test-123' },
        error: null
      })

      const ip = '192.168.1.1'

      // Make 5 successful requests
      for (let i = 0; i < 5; i++) {
        const request = new NextRequest('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: { 'x-forwarded-for': ip },
          body: JSON.stringify({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            message: 'Test message',
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
      }

      // 6th request should be rate limited
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'x-forwarded-for': ip },
        body: JSON.stringify({
          name: 'User 6',
          email: 'user6@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toContain('Too many requests')
    })
  })

  describe('Configuration', () => {
    it('should return warning when Resend not configured', async () => {
      delete process.env.RESEND_API_KEY

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.warning).toBeDefined()
      expect(mockResendSend).not.toHaveBeenCalled()
    })
  })
})
```

#### Update Jest Configuration

**File**: `/Users/michaelevans/DOA/doa-website/jest.config.js`

Ensure these settings are present:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
},
testEnvironment: 'node', // For API routes
```

#### Implementation Steps:
1. [ ] Create `__tests__` directory in `/Users/michaelevans/DOA/doa-website/src/app/api/contact/`
2. [ ] Create `route.test.ts` file
3. [ ] Copy test code above into file
4. [ ] Update jest.config.js if needed
5. [ ] Run tests: `cd /Users/michaelevans/DOA/doa-website && npm test -- route.test.ts`
6. [ ] Fix any failing tests
7. [ ] Ensure all tests pass

#### Verification:
- [ ] All 10+ test cases pass
- [ ] Tests cover success and failure paths
- [ ] Tests verify error handling
- [ ] Tests verify rate limiting
- [ ] Tests verify validation
- [ ] Test coverage > 80%

---

## Phase 3: MEDIUM PRIORITY (Do After Critical/High)

### Task 3.1: Add Email Monitoring and Alerting
**Priority**: MEDIUM
**Estimated Time**: 60 minutes

#### Option A: Resend Webhooks (Recommended)

Create webhook handler to track email delivery status:

**File**: Create `/Users/michaelevans/DOA/doa-website/src/app/api/webhooks/resend/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('resend-signature')

    if (!signature || !process.env.RESEND_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Verify signature
    const isValid = verifyWebhookSignature(
      payload,
      signature,
      process.env.RESEND_WEBHOOK_SECRET
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(payload)

    // Handle different event types
    switch (event.type) {
      case 'email.delivered':
        console.log('[Resend:Delivered]', {
          emailId: event.data.email_id,
          timestamp: event.created_at,
        })
        break

      case 'email.bounced':
        console.error('[Resend:Bounced]', {
          emailId: event.data.email_id,
          reason: event.data.bounce_reason,
          timestamp: event.created_at,
        })
        // TODO: Alert admin about bounced email
        break

      case 'email.complained':
        console.error('[Resend:Complaint]', {
          emailId: event.data.email_id,
          timestamp: event.created_at,
        })
        // TODO: Alert admin about spam complaint
        break

      case 'email.delivery_delayed':
        console.warn('[Resend:Delayed]', {
          emailId: event.data.email_id,
          timestamp: event.created_at,
        })
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Resend:WebhookError]', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
```

**Configure in Resend Dashboard**:
1. [ ] Go to https://resend.com/webhooks
2. [ ] Click "Add Webhook"
3. [ ] URL: `https://yourdomain.com/api/webhooks/resend`
4. [ ] Events: Select all email events
5. [ ] Copy webhook secret
6. [ ] Add to .env.local: `RESEND_WEBHOOK_SECRET=whsec_...`
7. [ ] Deploy to production
8. [ ] Test webhook with Resend's test feature

#### Option B: External Monitoring Service

Integrate with monitoring service (Sentry, LogRocket, etc.):

**File**: `/Users/michaelevans/DOA/doa-website/src/lib/monitoring.ts`

```typescript
// Initialize your monitoring service
// Example with Sentry:

import * as Sentry from '@sentry/nextjs'

export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    })
  }
}

export function trackEmailFailure(error: unknown, context: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { component: 'contact-form' },
      contexts: { email: context },
    })
  }
}
```

Then update route.ts to use monitoring:
```typescript
import { trackEmailFailure } from '@/lib/monitoring'

// In error handling:
if (adminEmailResult.error) {
  trackEmailFailure(adminEmailResult.error, {
    from: fromEmail,
    to: toEmail,
    formData: { name, email }
  })
  // ... rest of error handling
}
```

#### Implementation Steps:
1. [ ] Choose monitoring approach (Resend webhooks or external service)
2. [ ] If webhooks: Create webhook handler route
3. [ ] If webhooks: Configure in Resend dashboard
4. [ ] If external: Install monitoring SDK
5. [ ] If external: Add monitoring to route.ts
6. [ ] Add environment variables
7. [ ] Deploy and test
8. [ ] Verify alerts are received

---

## Testing Plan

### Pre-Deployment Testing

#### Unit Tests
```bash
cd /Users/michaelevans/DOA/doa-website
npm test -- route.test.ts
```

Expected Results:
- [ ] All tests pass
- [ ] Coverage > 80%
- [ ] No TypeScript errors

#### Local Integration Testing

**Test 1: Successful Submission**
```bash
cd /Users/michaelevans/DOA/doa-website
npm run dev
```

Then submit form at http://localhost:3000/contact with:
- Name: "Test User"
- Email: Your real email
- Message: "Test message - please verify receipt"

Expected Results:
- [ ] Form shows success message
- [ ] Console logs show `[ContactForm:Info]` entries
- [ ] Admin email received at CONTACT_FORM_TO_EMAIL
- [ ] Auto-reply received at submitted email
- [ ] Both emails contain correct content

**Test 2: Error Handling**

Temporarily change RESEND_API_KEY to invalid value:
```bash
RESEND_API_KEY=re_invalid_key npm run dev
```

Submit form and verify:
- [ ] Form shows error message
- [ ] Console logs show `[ContactForm:Error]` with details
- [ ] Response status is 500
- [ ] No emails sent

**Test 3: Rate Limiting**

Submit form 6 times in quick succession:
- [ ] First 5 submissions succeed
- [ ] 6th submission returns 429 error
- [ ] Error message includes "Too many requests"

#### Manual Testing Script

**File**: `/Users/michaelevans/DOA/doa-website/scripts/test-contact-email.js`

```javascript
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
}

testContactForm()
```

Run with:
```bash
node /Users/michaelevans/DOA/doa-website/scripts/test-contact-email.js
```

### Post-Deployment Testing

#### Production Smoke Test

After deploying to production:

1. [ ] Submit test form at https://yourdomain.com/contact
2. [ ] Verify admin email received
3. [ ] Verify auto-reply received
4. [ ] Check Resend dashboard for email status
5. [ ] Verify logs in Vercel dashboard
6. [ ] Test rate limiting (submit 6 times)
7. [ ] Test error handling (submit invalid data)

#### E2E Test with Playwright

**File**: `/Users/michaelevans/DOA/doa-website/tests/contact-form.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test('should successfully submit contact form', async ({ page }) => {
    await page.goto('/contact')

    // Fill form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message')

    // Submit
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('.success-message')).toBeVisible()
    await expect(page.locator('.success-message')).toContainText(
      'Your message has been sent successfully'
    )
  })

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/contact')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'not-an-email')
    await page.fill('textarea[name="message"]', 'Test message')

    await page.click('button[type="submit"]')

    await expect(page.locator('.error-message')).toBeVisible()
  })
})
```

Run with:
```bash
cd /Users/michaelevans/DOA/doa-website
npm run test:e2e
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] **Code Changes Complete**
  - [ ] Error handling fixed in route.ts
  - [ ] Logging utility added
  - [ ] All console.logs updated
  - [ ] Tests written and passing

- [ ] **Resend Configuration**
  - [ ] Domain verified in Resend dashboard
  - [ ] Production API key generated
  - [ ] Test email sent from Resend dashboard

- [ ] **Environment Variables**
  - [ ] Updated locally in .env.local
  - [ ] Updated in Vercel dashboard
  - [ ] All three variables present:
    - RESEND_API_KEY
    - RESEND_FROM_EMAIL
    - CONTACT_FORM_TO_EMAIL

- [ ] **Testing**
  - [ ] Unit tests pass locally
  - [ ] Integration tests pass locally
  - [ ] Manual testing complete
  - [ ] Test script runs successfully

### Deployment Steps

1. [ ] **Commit Changes**
   ```bash
   cd /Users/michaelevans/DOA/doa-website
   git add src/app/api/contact/route.ts
   git add src/app/api/contact/__tests__/route.test.ts
   git add scripts/test-contact-email.js
   git commit -m "fix: add error handling and logging for contact form emails

   - Check Resend API responses for errors before returning success
   - Add comprehensive logging with timestamps
   - Make auto-reply failure non-blocking
   - Add unit tests for API route
   - Add test script for manual verification

   Fixes silent email failures where users saw success but emails weren't sent"
   ```

2. [ ] **Push to Repository**
   ```bash
   git push origin main
   ```

3. [ ] **Monitor Deployment**
   - [ ] Watch Vercel deployment logs
   - [ ] Check for build errors
   - [ ] Verify environment variables loaded
   - [ ] Wait for deployment to complete

4. [ ] **Post-Deployment Verification**
   - [ ] Run production smoke test (see Testing Plan)
   - [ ] Check Vercel logs for any errors
   - [ ] Monitor Resend dashboard for email activity
   - [ ] Send real test submission

### Post-Deployment

- [ ] **Monitor for 24 Hours**
  - [ ] Check Resend dashboard daily
  - [ ] Review Vercel logs for errors
  - [ ] Test form submission once per day
  - [ ] Verify email delivery

- [ ] **Update Documentation**
  - [ ] Update /Users/michaelevans/DOA/doa-website/docs/RESEND_SETUP.md
  - [ ] Document error handling behavior
  - [ ] Document logging format
  - [ ] Add troubleshooting section

- [ ] **Update Memory Bank**
  - [ ] Update /Users/michaelevans/DOA/memory-bank/CURRENT.md
  - [ ] Document fix completion
  - [ ] Note any issues encountered
  - [ ] Record deployment date/time

---

## Rollback Plan

### If Emails Still Don't Send

**Symptoms**:
- Users report not receiving emails
- Resend dashboard shows failed sends
- Vercel logs show errors

**Rollback Steps**:

1. [ ] **Revert Code Changes**
   ```bash
   cd /Users/michaelevans/DOA/doa-website
   git log --oneline -5  # Find commit hash before fix
   git revert <commit-hash>
   git push origin main
   ```

2. [ ] **Check Environment Variables**
   - [ ] Verify RESEND_API_KEY is correct in Vercel
   - [ ] Verify domain is verified in Resend
   - [ ] Test API key with curl:
     ```bash
     curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer YOUR_API_KEY' \
       -H 'Content-Type: application/json' \
       -d '{
         "from": "contact@departmentofart.com",
         "to": "test@example.com",
         "subject": "Test",
         "html": "<p>Test email</p>"
       }'
     ```

3. [ ] **Temporary Workaround**

   If emails must work immediately, add failover to alternative service:

   ```typescript
   // In route.ts, after Resend fails:
   if (adminEmailResult.error) {
     // Try backup email service (SendGrid, Mailgun, etc.)
     console.log('Resend failed, trying backup service...')
     // ... backup implementation
   }
   ```

4. [ ] **Contact Support**
   - Resend Support: support@resend.com
   - Check Resend Status: https://status.resend.com
   - Vercel Support: https://vercel.com/support

### If Build Fails

**Symptoms**:
- Vercel deployment fails
- TypeScript errors
- Test failures

**Rollback Steps**:

1. [ ] **Check Build Logs**
   ```bash
   # Locally
   cd /Users/michaelevans/DOA/doa-website
   npm run build
   ```

2. [ ] **Fix TypeScript Errors**
   - [ ] Check route.ts for type issues
   - [ ] Run `npm run lint`
   - [ ] Fix any errors shown

3. [ ] **Revert if Unfixable**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### If Rate Limiting Too Aggressive

**Symptoms**:
- Legitimate users getting 429 errors
- Complaints about "too many requests"

**Fix**:
1. [ ] Increase rate limit in route.ts (line 36):
   ```typescript
   // Change from 5 to 10 submissions per hour
   if (recentSubmissions.length >= 10) {
   ```

2. [ ] Deploy fix immediately
3. [ ] Monitor for abuse

---

## Success Criteria

### Critical Success Metrics

Contact form is considered FIXED when:

- [x] **Code Quality**
  - [ ] API route checks Resend responses for errors
  - [ ] Admin email failure returns 500 status
  - [ ] Auto-reply failure is non-blocking
  - [ ] All logs include timestamps and context
  - [ ] No TypeScript errors or lint warnings

- [x] **Email Delivery**
  - [ ] Test submission delivers admin email to CONTACT_FORM_TO_EMAIL
  - [ ] Test submission delivers auto-reply to submitter
  - [ ] Emails contain correct content and formatting
  - [ ] From address is contact@departmentofart.com
  - [ ] Reply-to is set to submitter's email

- [x] **Error Handling**
  - [ ] Invalid submissions return appropriate error codes
  - [ ] Failed emails log detailed error information
  - [ ] Users see helpful error messages (not technical jargon)
  - [ ] No silent failures
  - [ ] All errors are caught and handled

- [x] **Testing**
  - [ ] Unit tests cover all success paths
  - [ ] Unit tests cover all failure paths
  - [ ] Test coverage > 80%
  - [ ] E2E test passes in CI/CD
  - [ ] Manual testing checklist complete

- [x] **Production Readiness**
  - [ ] Domain verified in Resend
  - [ ] Production API key configured
  - [ ] Environment variables set in Vercel
  - [ ] Monitoring/alerting active
  - [ ] Documentation updated

### Performance Metrics

- [ ] Form submission completes in < 3 seconds
- [ ] Emails delivered within 5 minutes
- [ ] Rate limiting blocks spam effectively
- [ ] No memory leaks or performance degradation

### User Experience Metrics

- [ ] Success message displays immediately after submission
- [ ] Error messages are clear and actionable
- [ ] Users receive auto-reply within 5 minutes
- [ ] Business owner receives notification within 5 minutes
- [ ] No false success messages

---

## Risk Matrix

### HIGH RISK

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Domain verification fails | Can't send emails | Medium | Use backup domain, contact Resend support |
| API key invalid/expired | All emails fail | Low | Test before deploy, monitor after |
| DNS propagation delay | Temporary failures | High | Wait 1 hour after DNS changes before testing |
| Production deployment breaks | Site down | Low | Test thoroughly locally, monitor deploy |

### MEDIUM RISK

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Increased spam from rate limit changes | More spam | Medium | Keep rate limiting, add honeypot field |
| Logging exposes sensitive data | Privacy issue | Low | Sanitize all logs, never log full emails |
| Auto-reply marked as spam | Users don't see reply | Medium | Follow email best practices, SPF/DKIM |
| Resend service outage | No emails temporarily | Low | Monitor status page, have backup plan |

### LOW RISK

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Test coverage gaps | Bugs slip through | Medium | Review tests thoroughly, add edge cases |
| Email formatting issues | Emails look bad | Low | Test templates in multiple email clients |
| Timezone display issues | Logs confusing | Low | Use ISO timestamps with timezone |

---

## Dependencies and Task Order

### Execution Order

```
Phase 1: CRITICAL (Do in parallel)
├── Task 1.1: Fix Error Handling (45 min)
└── Task 1.2: Configure Resend (60 min)
     ↓
Phase 2: HIGH PRIORITY (Do after Phase 1 complete)
├── Task 2.1: Add Logging (30 min)
└── Task 2.2: Add Tests (90 min)
     ↓
Phase 3: MEDIUM PRIORITY (Do after Phase 2 complete)
└── Task 3.1: Add Monitoring (60 min)
     ↓
Testing & Deployment (Do last)
├── Run all tests
├── Deploy to production
└── Verify in production
```

### Dependencies Graph

```
Configure Resend (1.2)
    ↓
Fix Error Handling (1.1)
    ↓
Add Logging (2.1)
    ↓
Add Tests (2.2)
    ↓
Add Monitoring (3.1)
    ↓
Deploy
```

**Note**: Tasks 1.1 and 1.2 can be done in parallel by different people, but 1.2 should complete first to have valid credentials for testing.

---

## Time Estimates

### By Phase

| Phase | Tasks | Estimated Time | Buffer | Total |
|-------|-------|----------------|--------|-------|
| Phase 1: Critical | 2 | 105 min | 15 min | 2 hours |
| Phase 2: High Priority | 2 | 120 min | 30 min | 2.5 hours |
| Phase 3: Medium Priority | 1 | 60 min | 15 min | 1.25 hours |
| Testing & Deployment | - | 45 min | 15 min | 1 hour |
| **Total** | **5 tasks** | **330 min** | **75 min** | **6.75 hours** |

### By Task

| Task | Time | Complexity | Risk |
|------|------|------------|------|
| 1.1: Fix Error Handling | 45 min | Medium | Low |
| 1.2: Configure Resend | 60 min | Low | Medium |
| 2.1: Add Logging | 30 min | Low | Low |
| 2.2: Add Tests | 90 min | High | Low |
| 3.1: Add Monitoring | 60 min | Medium | Low |

### Minimum Viable Fix

If time is critical, you can deploy with just Phase 1 (2 hours):
- Fix error handling
- Configure Resend
- Basic manual testing

Then add Phase 2 and 3 later for improved reliability and monitoring.

---

## Notes and Gotchas

### Resend Specific

1. **Test Mode Limitations**
   - Resend test API keys can only send to the account owner's email
   - Test mode emails appear in Resend dashboard but may not actually deliver
   - Always verify domain before production use

2. **Domain Verification**
   - DNS propagation can take 5 minutes to 48 hours
   - Use `dig TXT resend._domainkey.departmentofart.com` to check
   - Resend dashboard shows verification status
   - Can't send from unverified domain in production

3. **Rate Limits**
   - Free tier: 3,000 emails/month, 100 emails/day
   - Can be exceeded during testing
   - Monitor usage in Resend dashboard
   - Consider upgrading if needed

### Code Specific

1. **Type Safety**
   - Resend API returns union type: `{ data: T } | { error: E }`
   - Always check for error property first
   - TypeScript won't catch this automatically

2. **Logging**
   - Never log full email addresses in production
   - Use `email.replace(/(?<=.{2}).*(?=@)/, '***')` to sanitize
   - Never log API keys or secrets
   - Be careful with PII in logs

3. **Rate Limiting**
   - In-memory rate limiting resets on server restart
   - Consider Redis for production persistence
   - IP addresses can be spoofed - not foolproof
   - May need to whitelist certain IPs

### Testing Specific

1. **Jest Mocking**
   - Mock Resend before importing route
   - Reset mocks between tests
   - Test both success and error responses

2. **Integration Testing**
   - Use real Resend API key for integration tests
   - Set up separate test domain if possible
   - Clean up test emails regularly

3. **E2E Testing**
   - Playwright tests should use test database
   - Don't spam production inbox with test emails
   - Consider using mailhog or similar for E2E

---

## Quick Reference

### File Paths

```
/Users/michaelevans/DOA/doa-website/
├── src/app/api/contact/
│   ├── route.ts                          # Main API route (FIX HERE)
│   └── __tests__/route.test.ts           # Tests (CREATE)
├── scripts/
│   └── test-contact-email.js             # Test script (CREATE)
├── .env.local                             # Environment vars (UPDATE)
└── docs/
    └── RESEND_SETUP.md                   # Documentation (UPDATE)
```

### Environment Variables

```env
# Development (.env.local)
RESEND_API_KEY=re_YOUR_PRODUCTION_KEY
RESEND_FROM_EMAIL=contact@departmentofart.com
CONTACT_FORM_TO_EMAIL=mevans212@gmail.com

# Production (Vercel Dashboard)
Same as above
```

### Key Commands

```bash
# Development
cd /Users/michaelevans/DOA/doa-website
npm run dev

# Testing
npm test                                   # All tests
npm test -- route.test.ts                 # Specific test
node scripts/test-contact-email.js        # Manual test

# Deployment
git add .
git commit -m "fix: contact form email handling"
git push origin main

# Monitoring
# Check Resend: https://resend.com/emails
# Check Vercel: https://vercel.com/dashboard
```

### Support Contacts

- **Resend Support**: support@resend.com
- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Vercel Support**: https://vercel.com/support

---

## Appendix: Code Snippets

### Error Response Type Definition

Add to `/Users/michaelevans/DOA/doa-website/src/types/resend.ts`:

```typescript
export interface ResendResponse<T> {
  data: T | null
  error: {
    message: string
    name: string
  } | null
}

export interface EmailData {
  id: string
}
```

### Email Validation Utility

Add to `/Users/michaelevans/DOA/doa-website/src/lib/validation.ts`:

```typescript
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeEmailForLogging(email: string): string {
  return email.replace(/(?<=.{2}).*(?=@)/, '***')
}

export function validateContactFormData(data: {
  name: string
  email: string
  message: string
}): { valid: boolean; error?: string } {
  if (!data.name || !data.email || !data.message) {
    return { valid: false, error: 'Missing required fields' }
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: 'Invalid email address' }
  }

  if (data.message.length > 5000) {
    return { valid: false, error: 'Message is too long (max 5000 characters)' }
  }

  return { valid: true }
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-14 | Claude Code | Initial implementation plan created |

---

**END OF PLAN**

For questions or issues during implementation, refer to:
- `/Users/michaelevans/DOA/doa-website/docs/RESEND_SETUP.md`
- `/Users/michaelevans/DOA/memory-bank/CURRENT.md`
- Resend documentation at https://resend.com/docs
