# Vercel KV Rate Limiting Implementation Plan

## Executive Summary

Replace the in-memory Map-based rate limiting in the contact form API route with Vercel KV (Redis) to ensure persistent, shared rate limiting across serverless function instances.

**Current Problem:**
- In-memory Map resets on cold starts (every ~5-15 minutes in serverless)
- Not shared across concurrent function instances
- Users can bypass rate limits by triggering cold starts

**Solution:**
- Vercel KV provides persistent Redis storage
- Shared state across all function instances
- Survives cold starts and redeployments

**Estimated Total Time:** 2-3 hours
**Risk Level:** Medium (external service dependency)

---

## Table of Contents

1. [Setup & Dependencies](#1-setup--dependencies)
2. [Code Changes](#2-code-changes)
3. [Implementation Steps](#3-implementation-steps)
4. [Configuration](#4-configuration)
5. [Testing Strategy](#5-testing-strategy)
6. [Rollback Plan](#6-rollback-plan)
7. [Deployment Checklist](#7-deployment-checklist)

---

## 1. Setup & Dependencies

### 1.1 Install Required Packages

**Time:** 5 minutes

```bash
cd /Users/michaelevans/DOA/doa-website
npm install @vercel/kv
```

**Package Details:**
- `@vercel/kv`: Official Vercel KV SDK for Redis operations
- Version: Latest stable (currently ~1.0.0+)
- No additional dependencies required

### 1.2 Enable Vercel KV in Dashboard

**Time:** 10 minutes

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `doa-website` (or current production project)
3. Navigate to: **Storage** tab
4. Click: **Create Database** → **KV (Redis)**
5. Configure:
   - **Name:** `doa-rate-limiting`
   - **Region:** Select closest to your primary users (e.g., `us-east-1`)
   - **Plan:** Free tier (sufficient for contact form rate limiting)
6. Click: **Create**

**What This Creates:**
- A Redis instance hosted by Vercel (Upstash under the hood)
- Free tier includes:
  - 256 MB storage
  - 10,000 commands/day
  - 1 GB bandwidth/month
  - More than sufficient for rate limiting

### 1.3 Environment Variables

**Automatic Configuration:**
When you create a KV database in Vercel, these environment variables are **automatically added** to your project:

```bash
KV_URL=           # Connection URL for the KV store
KV_REST_API_URL=  # REST API endpoint
KV_REST_API_TOKEN=# Authentication token
KV_REST_API_READ_ONLY_TOKEN= # Optional read-only token
```

**Manual Local Setup (for testing):**

1. Get KV credentials from Vercel dashboard:
   - Go to **Storage** → `doa-rate-limiting` → **.env.local** tab
   - Copy all `KV_*` variables

2. Add to `/Users/michaelevans/DOA/doa-website/.env.local`:

```bash
# Vercel KV Configuration (for rate limiting)
KV_URL=redis://default:***@***-us1-1.upstash.io:6379
KV_REST_API_URL=https://***-us1-1.upstash.io
KV_REST_API_TOKEN=***
KV_REST_API_READ_ONLY_TOKEN=***
```

**Important Notes:**
- Production deployment will use Vercel's auto-configured values
- Local `.env.local` is for development testing only
- Never commit `.env.local` to git (already in `.gitignore`)

### 1.4 Local Development Alternative

**For local testing without Vercel KV:**

Option A: Use Vercel's production KV instance
- Add production KV credentials to local `.env.local`
- Risk: Could interfere with production rate limits

Option B: Run local Redis (recommended)
```bash
# Install Redis locally (macOS)
brew install redis

# Start Redis server
redis-server

# Set local environment variable
KV_URL=redis://localhost:6379
```

Option C: Skip KV in development
- Code includes fallback logic (see section 2.3)
- Rate limiting disabled if KV unavailable

**Recommendation:** Use Option C during initial development, then Option A for final testing.

---

## 2. Code Changes

### 2.1 File Overview

**Single File Change:**
- `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`

**Lines to Modify:**
- Lines 45-73: Replace in-memory rate limiting
- Lines 224-226: Update submission recording
- Add new imports at top

**Estimated Code Changes:**
- Remove: ~30 lines (old implementation)
- Add: ~50 lines (new implementation + error handling)
- Net change: +20 lines

### 2.2 Import Changes

**Location:** Top of file (after line 6)

**Add:**
```typescript
import { kv } from '@vercel/kv'
```

**Updated import block:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ContactFormEmail from '@/emails/ContactFormEmail'
import ContactFormAutoReply from '@/emails/ContactFormAutoReply'
import { client } from '../../../../sanity/lib/client'
import { emailSettingsQuery } from '../../../../sanity/lib/queries'
import { kv } from '@vercel/kv'
```

### 2.3 Rate Limiting Function Replacement

**Remove lines 45-73 (entire old implementation):**
```typescript
// DELETE THIS BLOCK
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
```

**Replace with (insert at line 45):**
```typescript
// Rate limiting configuration
const RATE_LIMIT_MAX_SUBMISSIONS = 5
const RATE_LIMIT_WINDOW_MS = 3600000 // 1 hour in milliseconds
const RATE_LIMIT_KEY_PREFIX = 'contact_form_rate_limit:'

/**
 * Check if an IP address has exceeded rate limits using Vercel KV (Redis)
 * Falls back to allowing requests if KV is unavailable (graceful degradation)
 */
async function getRateLimitStatus(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const now = Date.now()
    const oneHourAgo = now - RATE_LIMIT_WINDOW_MS
    const key = `${RATE_LIMIT_KEY_PREFIX}${ip}`

    // Get timestamps from KV (Redis sorted set would be ideal, but using JSON array for simplicity)
    const timestampsJson = await kv.get<string>(key)
    const timestamps: number[] = timestampsJson ? JSON.parse(timestampsJson) : []

    // Filter out old timestamps (older than 1 hour)
    const recentSubmissions = timestamps.filter(t => t > oneHourAgo)

    // Check if rate limit exceeded
    if (recentSubmissions.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
      const oldestTimestamp = recentSubmissions[0]
      const retryAfter = Math.ceil((oldestTimestamp + RATE_LIMIT_WINDOW_MS - now) / 1000)

      logContactFormEvent('warn', 'Rate limit exceeded', {
        ip,
        submissionCount: recentSubmissions.length,
        retryAfter
      })

      return { allowed: false, retryAfter }
    }

    return { allowed: true }

  } catch (error) {
    // Graceful degradation: if KV is unavailable, log error and allow request
    // This prevents KV outages from breaking the contact form entirely
    logContactFormEvent('error', 'Rate limiting check failed - allowing request', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip,
      fallbackBehavior: 'allow'
    })

    // Return allowed: true as fallback (fail open, not fail closed)
    return { allowed: true }
  }
}

/**
 * Record a submission timestamp for rate limiting using Vercel KV (Redis)
 */
async function recordSubmission(ip: string): Promise<void> {
  try {
    const now = Date.now()
    const oneHourAgo = now - RATE_LIMIT_WINDOW_MS
    const key = `${RATE_LIMIT_KEY_PREFIX}${ip}`

    // Get current timestamps
    const timestampsJson = await kv.get<string>(key)
    const timestamps: number[] = timestampsJson ? JSON.parse(timestampsJson) : []

    // Add new timestamp and filter out old ones
    const updatedTimestamps = [...timestamps, now].filter(t => t > oneHourAgo)

    // Store back in KV with expiration (2 hours to be safe)
    // This ensures old data is automatically cleaned up
    await kv.set(key, JSON.stringify(updatedTimestamps), { ex: 7200 })

    logContactFormEvent('info', 'Submission recorded for rate limiting', {
      ip,
      submissionCount: updatedTimestamps.length
    })

  } catch (error) {
    // Non-blocking: if recording fails, log error but don't fail the request
    logContactFormEvent('error', 'Failed to record submission for rate limiting', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip
    })
  }
}
```

### 2.4 Update POST Handler - Rate Limit Check

**Location:** Line 99-110

**Change from synchronous to async call:**

**Before:**
```typescript
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
```

**After:**
```typescript
// Check rate limit
const rateLimitStatus = await getRateLimitStatus(ip)
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
```

**Change:** Add `await` keyword (line 99)

### 2.5 Update POST Handler - Record Submission

**Location:** Lines 224-226

**Replace entire block:**

**Before:**
```typescript
// Record submission for rate limiting
const timestamps = submissionTimestamps.get(ip) || []
timestamps.push(Date.now())
submissionTimestamps.set(ip, timestamps)
```

**After:**
```typescript
// Record submission for rate limiting
await recordSubmission(ip)
```

**Change:** Replace 4 lines with 2 lines (simpler, cleaner)

---

## 3. Implementation Steps

### Phase 1: Preparation (15 minutes)

**Step 1.1: Create feature branch**
```bash
cd /Users/michaelevans/DOA/doa-website
git checkout -b feature/vercel-kv-rate-limiting
```

**Step 1.2: Install dependencies**
```bash
npm install @vercel/kv
```

**Step 1.3: Verify build**
```bash
npm run build
```

**Success criteria:** Build completes without errors

---

### Phase 2: Code Implementation (30 minutes)

**Step 2.1: Add import**
- Open: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
- Location: After line 7
- Add: `import { kv } from '@vercel/kv'`

**Step 2.2: Replace rate limiting logic**
- Remove: Lines 45-73 (old implementation)
- Insert: New implementation from section 2.3
- Verify: Function signature changes from `function getRateLimitStatus` to `async function getRateLimitStatus`

**Step 2.3: Update rate limit check**
- Location: Line ~99
- Change: `const rateLimitStatus = getRateLimitStatus(ip)`
- To: `const rateLimitStatus = await getRateLimitStatus(ip)`

**Step 2.4: Update submission recording**
- Location: Lines ~224-226
- Replace: 4 lines of Map code
- With: `await recordSubmission(ip)`

**Step 2.5: Verify TypeScript**
```bash
npm run lint
```

**Success criteria:** No TypeScript or lint errors

---

### Phase 3: Vercel KV Setup (15 minutes)

**Step 3.1: Create KV database**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to project → **Storage** tab
3. Create KV database named `doa-rate-limiting`
4. Select region closest to users

**Step 3.2: Verify environment variables**
1. Check that `KV_*` variables are auto-added
2. Go to project **Settings** → **Environment Variables**
3. Verify presence of:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

**Step 3.3: Copy to local environment (optional)**
1. Go to **Storage** → `doa-rate-limiting` → **.env.local** tab
2. Copy all `KV_*` variables
3. Add to `/Users/michaelevans/DOA/doa-website/.env.local`

**Success criteria:** Environment variables present in Vercel dashboard

---

### Phase 4: Testing (45 minutes)

See [Section 5: Testing Strategy](#5-testing-strategy) for detailed test cases.

---

### Phase 5: Deployment (15 minutes)

**Step 5.1: Commit changes**
```bash
git add package.json package-lock.json src/app/api/contact/route.ts
git commit -m "feat: add Vercel KV-based rate limiting to contact form

- Replace in-memory Map with Vercel KV (Redis) for persistent rate limiting
- Add graceful degradation if KV unavailable (fail open)
- Maintain same rate limit: 5 submissions per hour per IP
- Auto-cleanup old timestamps with KV expiration (2 hours)
- Add detailed logging for rate limit events

Fixes issue where rate limits reset on serverless cold starts"
```

**Step 5.2: Push to GitHub**
```bash
git push origin feature/vercel-kv-rate-limiting
```

**Step 5.3: Create pull request**
```bash
gh pr create --title "Add Vercel KV rate limiting to contact form" --body "$(cat <<'EOF'
## Summary
- Replaces in-memory Map-based rate limiting with Vercel KV (Redis)
- Ensures persistent rate limiting across serverless cold starts
- Adds graceful degradation if KV unavailable

## Changes
- Install @vercel/kv package
- Refactor getRateLimitStatus to use async KV operations
- Add recordSubmission helper function
- Implement fail-open strategy (allow requests if KV fails)
- Add KV expiration to auto-cleanup old data

## Testing
- [ ] Unit tests pass: npm test
- [ ] Build succeeds: npm run build
- [ ] Rate limiting works in production
- [ ] Cold starts don't reset rate limits
- [ ] Graceful degradation if KV unavailable

## Configuration Required
- Vercel KV database created: doa-rate-limiting
- Environment variables auto-configured in Vercel

Generated with Claude Code
EOF
)"
```

**Step 5.4: Deploy to production**
1. Merge pull request on GitHub
2. Vercel auto-deploys to production
3. Monitor deployment logs for errors

---

## 4. Configuration

### 4.1 Vercel KV Setup

**Database Configuration:**
```
Name: doa-rate-limiting
Type: KV (Redis)
Region: us-east-1 (or closest to your users)
Plan: Free
  - 256 MB storage
  - 10,000 commands/day
  - 1 GB bandwidth/month
```

**Automatic Environment Variables:**
Vercel automatically adds these to your project when you create a KV database:
- `KV_URL`: Full Redis connection URL
- `KV_REST_API_URL`: REST API endpoint
- `KV_REST_API_TOKEN`: Authentication token
- `KV_REST_API_READ_ONLY_TOKEN`: Read-only token (optional)

**No Manual Configuration Required:** The `@vercel/kv` package automatically uses these environment variables.

### 4.2 Environment Variables

**Production (Vercel Dashboard):**
- Auto-configured when KV database created
- Check: Project → Settings → Environment Variables
- Applies to: Production, Preview, Development

**Local Development:**
Add to `/Users/michaelevans/DOA/doa-website/.env.local`:

```bash
# Vercel KV - Rate Limiting
KV_URL=redis://default:***@***-us1-1.upstash.io:6379
KV_REST_API_URL=https://***-us1-1.upstash.io
KV_REST_API_TOKEN=***
```

**Get Values From:**
Vercel Dashboard → Storage → doa-rate-limiting → .env.local tab

### 4.3 Rate Limit Configuration

**Current Settings (in code):**
```typescript
const RATE_LIMIT_MAX_SUBMISSIONS = 5      // Max submissions per window
const RATE_LIMIT_WINDOW_MS = 3600000      // 1 hour window
const RATE_LIMIT_KEY_PREFIX = 'contact_form_rate_limit:'
```

**To Adjust Rate Limits:**
Edit these constants in `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`

**Examples:**
```typescript
// More strict: 3 per hour
const RATE_LIMIT_MAX_SUBMISSIONS = 3

// Less strict: 10 per hour
const RATE_LIMIT_MAX_SUBMISSIONS = 10

// Shorter window: 30 minutes
const RATE_LIMIT_WINDOW_MS = 1800000

// Longer window: 24 hours
const RATE_LIMIT_WINDOW_MS = 86400000
```

### 4.4 KV Data Structure

**Key Format:**
```
contact_form_rate_limit:{ip_address}
```

**Value Format (JSON string):**
```json
"[1697234567890, 1697234890123, 1697235123456]"
```

**Expiration:**
- TTL: 7200 seconds (2 hours)
- Auto-cleanup: Keys expire automatically
- Ensures old data doesn't accumulate

**Storage Estimate:**
- Average key size: ~60 bytes
- Average value size: ~50 bytes (5 timestamps)
- Total per IP: ~110 bytes
- 10,000 IPs = ~1.1 MB (well within free tier)

---

## 5. Testing Strategy

### 5.1 Local Development Testing

**Prerequisite:** KV credentials in `.env.local`

**Test 1: Single Submission (Should Succeed)**
```bash
cd /Users/michaelevans/DOA/doa-website
node scripts/test-contact-email.js
```

Expected result: Success response

**Test 2: Multiple Submissions (Should Rate Limit)**
Create test script: `/Users/michaelevans/DOA/doa-website/scripts/test-rate-limit.js`

```javascript
const BASE_URL = 'http://localhost:3000'

async function testRateLimit() {
  console.log('Testing rate limiting...\n')

  for (let i = 1; i <= 7; i++) {
    console.log(`Submission ${i}:`)

    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Test User ${i}`,
        email: 'test@example.com',
        message: `Test message ${i}`
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, data)

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After')
      console.log(`Rate limited! Retry after: ${retryAfter}s`)
    }

    console.log('---\n')

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

testRateLimit().catch(console.error)
```

**Run test:**
```bash
# Start dev server
npm run dev

# In another terminal
node scripts/test-rate-limit.js
```

**Expected results:**
- Submissions 1-5: Success (200)
- Submissions 6-7: Rate limited (429)
- Retry-After header present on 429 responses

### 5.2 Vercel KV Data Inspection

**Check data in KV:**

Create inspection script: `/Users/michaelevans/DOA/doa-website/scripts/inspect-kv.js`

```javascript
import { kv } from '@vercel/kv'

async function inspectKV() {
  console.log('Inspecting Vercel KV data...\n')

  // Test IP to check
  const testIP = '127.0.0.1'
  const key = `contact_form_rate_limit:${testIP}`

  const data = await kv.get(key)
  console.log(`Key: ${key}`)
  console.log(`Value:`, data)

  if (data) {
    const timestamps = JSON.parse(data)
    console.log(`\nSubmission count: ${timestamps.length}`)
    console.log(`Timestamps:`)
    timestamps.forEach((ts, i) => {
      const date = new Date(ts)
      console.log(`  ${i + 1}. ${date.toISOString()}`)
    })
  } else {
    console.log('No data found for this IP')
  }
}

inspectKV().catch(console.error)
```

**Run:**
```bash
node --loader ts-node/esm scripts/inspect-kv.js
```

### 5.3 Production Testing

**Test Case 1: Rate Limiting Works**
1. Deploy to production
2. Submit contact form 5 times quickly
3. Verify 6th submission returns 429

**Test Case 2: Cold Start Persistence**
1. Submit form once
2. Wait 15 minutes (trigger cold start)
3. Submit 4 more times
4. Verify 5th submission still rate limited

**Test Case 3: Retry-After Header**
1. Get rate limited (429 response)
2. Check `Retry-After` header
3. Wait for retry period
4. Submit again - should succeed

**Test Case 4: Different IPs Isolated**
1. Submit from IP A 5 times (rate limited)
2. Submit from IP B - should succeed
3. Verifies per-IP isolation

### 5.4 Error Handling Testing

**Test Case 5: KV Unavailable (Graceful Degradation)**

Temporarily break KV connection:
```typescript
// In route.ts, temporarily add this before getRateLimitStatus:
throw new Error('KV unavailable')
```

Expected behavior:
- Logs error: "Rate limiting check failed - allowing request"
- Request succeeds (fail open strategy)
- Contact form remains functional

**Test Case 6: KV Timeout**
Set very short timeout to simulate network issues:
```typescript
const timestampsJson = await kv.get(key, { timeout: 1 }) // 1ms timeout
```

Expected behavior:
- Times out gracefully
- Logs error
- Allows request through

### 5.5 Automated Test Suite

**Create test file:** `/Users/michaelevans/DOA/doa-website/src/app/api/contact/__tests__/route.kv.test.ts`

```typescript
import { POST } from '../route'
import { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

// Mock @vercel/kv
jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  }
}))

describe('Contact API - Vercel KV Rate Limiting', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow first submission', async () => {
    // Mock empty KV (no previous submissions)
    (kv.get as jest.Mock).mockResolvedValue(null)
    (kv.set as jest.Mock).mockResolvedValue('OK')

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })

  it('should rate limit after 5 submissions', async () => {
    const now = Date.now()
    const recentTimestamps = [
      now - 1000,
      now - 2000,
      now - 3000,
      now - 4000,
      now - 5000
    ]

    // Mock KV with 5 recent submissions
    (kv.get as jest.Mock).mockResolvedValue(JSON.stringify(recentTimestamps))

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'x-forwarded-for': '192.168.1.1' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBeTruthy()
  })

  it('should filter out old timestamps', async () => {
    const now = Date.now()
    const mixedTimestamps = [
      now - 7200000, // 2 hours ago (should be filtered)
      now - 3600000, // 1 hour ago (should be filtered)
      now - 1000,    // 1 second ago (should be kept)
    ]

    (kv.get as jest.Mock).mockResolvedValue(JSON.stringify(mixedTimestamps))
    (kv.set as jest.Mock).mockResolvedValue('OK')

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'x-forwarded-for': '192.168.1.1' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200) // Should allow (only 1 recent submission)
  })

  it('should gracefully degrade if KV fails', async () => {
    // Mock KV error
    (kv.get as jest.Mock).mockRejectedValue(new Error('KV unavailable'))

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200) // Should allow (fail open)
  })
})
```

**Run tests:**
```bash
npm test -- route.kv.test.ts
```

---

## 6. Rollback Plan

### 6.1 Immediate Rollback (If Critical Issue)

**Scenario:** KV causing production errors, contact form broken

**Time to Execute:** 5 minutes

**Steps:**

1. **Revert to previous deployment:**
```bash
# In Vercel Dashboard
# Go to: Deployments tab
# Find: Previous working deployment
# Click: "..." menu → "Promote to Production"
```

2. **Verify contact form works:**
   - Test submission on production site
   - Check logs for errors

**Result:** Contact form functional with old in-memory rate limiting

### 6.2 Code Rollback (If Deployment Unavailable)

**Scenario:** Need to rollback code changes directly

**Time to Execute:** 10 minutes

**Steps:**

1. **Revert git commit:**
```bash
cd /Users/michaelevans/DOA/doa-website
git revert HEAD
git push origin main
```

2. **Vercel auto-deploys reverted code**

3. **Verify deployment:**
   - Check Vercel dashboard
   - Test contact form

**Result:** Back to in-memory rate limiting

### 6.3 Fallback Strategy (If KV Unavailable)

**Scenario:** KV service down, but code deployed

**Built-in Protection:**
The implementation includes graceful degradation:

```typescript
catch (error) {
  logContactFormEvent('error', 'Rate limiting check failed - allowing request', {
    error: error instanceof Error ? error.message : 'Unknown error',
    ip,
    fallbackBehavior: 'allow'
  })
  return { allowed: true } // Fail open
}
```

**What Happens:**
- KV errors are caught
- Logged for monitoring
- Requests allowed through
- Contact form remains functional
- Rate limiting temporarily disabled

**Monitoring:**
Check logs for:
```
[ContactForm:Error] Rate limiting check failed - allowing request
```

### 6.4 Partial Rollback (KV Data Cleanup)

**Scenario:** KV data corrupted or needs reset

**Steps:**

1. **Clear all rate limit data:**

Create cleanup script: `/Users/michaelevans/DOA/doa-website/scripts/clear-rate-limits.js`

```javascript
import { kv } from '@vercel/kv'

async function clearRateLimits() {
  console.log('Clearing all rate limit data from KV...')

  // Get all keys with our prefix
  const keys = await kv.keys('contact_form_rate_limit:*')

  console.log(`Found ${keys.length} keys to delete`)

  // Delete all keys
  for (const key of keys) {
    await kv.del(key)
    console.log(`Deleted: ${key}`)
  }

  console.log('Done!')
}

clearRateLimits().catch(console.error)
```

Run:
```bash
node --loader ts-node/esm scripts/clear-rate-limits.js
```

2. **Clear specific IP:**
```javascript
import { kv } from '@vercel/kv'

const ip = '192.168.1.1' // Replace with target IP
const key = `contact_form_rate_limit:${ip}`

await kv.del(key)
console.log(`Cleared rate limit for IP: ${ip}`)
```

### 6.5 Rollback Decision Matrix

| Issue | Severity | Action | Time |
|-------|----------|--------|------|
| KV completely broken | Critical | Revert deployment | 5 min |
| KV intermittent errors | High | Monitor (graceful degradation active) | N/A |
| Rate limiting not working | Medium | Check KV data, clear if needed | 10 min |
| False positives | Low | Adjust rate limit constants | 30 min |
| Need to whitelist IP | Low | Clear specific IP data | 5 min |

---

## 7. Deployment Checklist

### 7.1 Pre-Deployment

**Code Review:**
- [ ] All TypeScript errors resolved
- [ ] No lint errors (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Import statement added for `@vercel/kv`
- [ ] Old Map code completely removed
- [ ] Async/await added to function calls
- [ ] Error handling includes graceful degradation

**Vercel Setup:**
- [ ] KV database created in Vercel dashboard
- [ ] Database named: `doa-rate-limiting`
- [ ] Environment variables auto-configured
- [ ] Region selected (close to users)
- [ ] Free tier limits understood (10k commands/day)

**Documentation:**
- [ ] This plan document reviewed
- [ ] Rollback plan understood
- [ ] Testing strategy prepared
- [ ] Team notified of deployment

### 7.2 Deployment Steps

**1. Commit and Push:**
```bash
git add -A
git commit -m "feat: add Vercel KV-based rate limiting"
git push origin feature/vercel-kv-rate-limiting
```

**2. Create Pull Request:**
```bash
gh pr create --title "Add Vercel KV rate limiting" --body "See memory-bank/VERCEL_KV_RATE_LIMITING_PLAN.md"
```

**3. Review:**
- [ ] Code review completed
- [ ] Tests pass in CI
- [ ] Preview deployment works

**4. Merge:**
```bash
gh pr merge --squash
```

**5. Monitor Deployment:**
- [ ] Vercel deployment starts automatically
- [ ] Build completes successfully
- [ ] Function logs show no errors

### 7.3 Post-Deployment Verification

**Immediate Checks (0-5 minutes):**

1. **Verify deployment:**
   - [ ] Check Vercel dashboard: Deployment status = "Ready"
   - [ ] No build errors in logs
   - [ ] Function successfully deployed

2. **Test contact form:**
   - [ ] Single submission succeeds
   - [ ] Email received
   - [ ] No errors in logs

3. **Check KV connection:**
   - [ ] No KV errors in function logs
   - [ ] Data written to KV (check with inspect script)

**Functional Testing (5-15 minutes):**

4. **Test rate limiting:**
   - [ ] Submit 5 times quickly
   - [ ] 6th submission returns 429
   - [ ] Retry-After header present
   - [ ] Error message correct

5. **Verify KV data:**
   - [ ] Run inspect script (see section 5.2)
   - [ ] Timestamps stored correctly
   - [ ] TTL set to 7200 seconds

**Monitoring (15 minutes - 1 hour):**

6. **Watch logs:**
```bash
vercel logs --follow
```

Look for:
- [ ] No KV errors
- [ ] Rate limit events logged correctly
- [ ] Submissions recorded properly

7. **Check metrics:**
   - Vercel Dashboard → Analytics
   - [ ] API route response times normal
   - [ ] No increase in 500 errors
   - [ ] 429 responses appearing (if rate limited)

**Extended Testing (1-24 hours):**

8. **Cold start test:**
   - [ ] Wait 15-30 minutes for cold start
   - [ ] Submit again
   - [ ] Rate limit persists (key test!)

9. **Different IPs test:**
   - [ ] Submit from different networks/devices
   - [ ] Each IP tracked separately

10. **Cleanup test:**
    - [ ] Wait >2 hours
    - [ ] Old data expires from KV
    - [ ] Storage not growing indefinitely

### 7.4 Monitoring and Alerts

**What to Monitor:**

1. **Function Logs (Vercel Dashboard):**
   - Search for: `Rate limiting check failed`
   - Should be: 0 occurrences (unless KV down)

2. **KV Metrics (Vercel Storage Dashboard):**
   - Commands per day: Should be < 10,000
   - Storage used: Should be < 1 MB
   - Response time: Should be < 50ms

3. **API Errors:**
   - 429 responses: Expected (rate limiting working)
   - 500 responses: Should not increase
   - KV timeout errors: Should be 0

**Alert Thresholds:**

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| KV errors/hour | > 10 | > 50 | Check KV status, consider rollback |
| KV response time | > 100ms | > 500ms | Check Vercel status |
| 500 errors | > 5/hour | > 20/hour | Rollback immediately |
| KV commands/day | > 8,000 | > 9,500 | Investigate unusual traffic |

**Recommended Tools:**
- Vercel built-in monitoring (free)
- Sentry for error tracking (optional)
- Custom CloudWatch alerts (advanced)

### 7.5 Success Criteria

Deployment is successful when:

- [ ] All pre-deployment checks pass
- [ ] Deployment completes without errors
- [ ] Contact form accepts submissions
- [ ] Rate limiting works (5 per hour)
- [ ] 429 responses returned after 5 submissions
- [ ] Retry-After header present
- [ ] KV data stored correctly
- [ ] Cold starts don't reset rate limits
- [ ] No increase in errors or response times
- [ ] Logs show expected behavior
- [ ] 24-hour monitoring shows stability

---

## Appendix

### A. Key Design Decisions

**1. Fail Open vs Fail Closed**
- **Decision:** Fail open (allow requests if KV unavailable)
- **Reasoning:** Contact form availability > strict rate limiting
- **Trade-off:** Temporary spam risk vs permanent functionality loss

**2. JSON Array vs Redis Sorted Sets**
- **Decision:** JSON array of timestamps
- **Reasoning:** Simpler, sufficient for low-volume contact form
- **Alternative:** Redis sorted sets (more efficient, but more complex)

**3. TTL of 2 Hours**
- **Decision:** 7200 seconds (2 hours)
- **Reasoning:** 1-hour window + 1-hour buffer for cleanup
- **Ensures:** Data auto-expires, no manual cleanup needed

**4. Per-IP Isolation**
- **Decision:** Separate KV keys per IP
- **Reasoning:** Prevents one user from affecting others
- **Security:** Resistant to distributed attacks

### B. Performance Considerations

**KV Operation Costs:**
- `kv.get()`: 1 command (~1ms)
- `kv.set()`: 1 command (~2ms)
- Per request: 2 commands total

**Free Tier Limits:**
- 10,000 commands/day
- = 5,000 contact form checks/day
- = 208 checks/hour
- = 3.5 checks/minute

**Expected Usage:**
- Legitimate traffic: ~10-50 submissions/day
- = 100 commands/day
- = 1% of free tier

**Headroom:**
- 100x capacity for traffic spikes
- Can handle DDoS attempts

**Latency Impact:**
- KV adds: ~3-5ms per request
- Total API time: ~500-1000ms (email sending)
- KV overhead: <1% of total time

### C. Security Considerations

**IP Spoofing:**
- Vercel provides reliable `x-forwarded-for`
- Not easily spoofable on Vercel platform
- Risk: Low

**Data Privacy:**
- Only IPs and timestamps stored
- No PII in KV
- GDPR compliant (IP is pseudonymous data)

**DDoS Protection:**
- Rate limiting helps prevent abuse
- Fail-open prevents KV outage from amplifying DDoS
- Layer 7 DDoS should be handled by Vercel/Cloudflare

**Key Enumeration:**
- Keys include IPs (not secret)
- No sensitive data exposure risk

### D. Cost Analysis

**Current Plan: Vercel KV Free Tier**
- Cost: $0/month
- Limits:
  - 256 MB storage
  - 10,000 commands/day
  - 1 GB bandwidth/month

**Estimated Usage:**
- Storage: ~1 MB (10,000 IPs at 110 bytes each)
- Commands: ~100/day (50 submissions × 2 commands)
- Bandwidth: ~10 MB/month

**Margin:** 99% below free tier limits

**If Exceeding Free Tier:**
- Pro tier: $10/month
- Limits:
  - 1 GB storage
  - 100,000 commands/day
  - 10 GB bandwidth/month

**Break-even:** ~5,000 submissions/day (highly unlikely for contact form)

### E. Alternative Solutions Considered

**1. Upstash Redis (Direct)**
- **Pros:** Same backend as Vercel KV, slightly cheaper
- **Cons:** Separate billing, manual setup
- **Decision:** Use Vercel KV for convenience

**2. Vercel Edge Config**
- **Pros:** Read-optimized, very fast
- **Cons:** Read-only at edge, writes slow
- **Decision:** Not suitable (need writes)

**3. Database (PostgreSQL/MySQL)**
- **Pros:** Already have data persistence story
- **Cons:** Overkill for simple rate limiting
- **Decision:** Too heavy for this use case

**4. Cloudflare Workers KV**
- **Pros:** Global edge network
- **Cons:** Not on Cloudflare, separate platform
- **Decision:** Stick with Vercel ecosystem

**5. In-Memory + Database Hybrid**
- **Pros:** Fast reads from memory
- **Cons:** Complex, still has cold start issues
- **Decision:** Not worth complexity

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-14 | Claude | Initial plan created |

---

*Generated with Claude Code for DOA Website*
*Reference: /Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts*
