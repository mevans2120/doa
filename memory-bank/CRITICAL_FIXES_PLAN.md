# Critical Security Fixes Implementation Plan

**Project**: DOA Website
**Date**: 2025-10-15
**Status**: Planning Phase
**Priority**: CRITICAL

## Executive Summary

This plan addresses 7 critical and high-priority security issues identified in the security audit. The issues range from production-breaking serverless incompatibilities to information disclosure risks. Total estimated implementation time: 16-20 hours including testing and deployment.

**Key Risk**: Issue #1 (setInterval in serverless) is actively crashing production deployments and MUST be fixed before any other changes.

## Risk Matrix

| Issue | Severity | Fix Complexity | Regression Risk | Business Impact | Priority | Est. Hours |
|-------|----------|----------------|-----------------|-----------------|----------|------------|
| 1. setInterval in API | CRITICAL | Medium | Low | Production DOWN | P0 | 3-4h |
| 2. Test endpoint exposed | CRITICAL | Simple | Low | Security breach | P0 | 1h |
| 3. Missing CSP headers | CRITICAL | Medium | Medium | XSS vulnerability | P1 | 2-3h |
| 4. Console.log statements | HIGH | Simple | Low | Info disclosure | P2 | 2h |
| 5. No error boundaries | HIGH | Medium | Low | Poor UX | P2 | 3-4h |
| 6. TypeScript any types | HIGH | Medium | Medium | Type safety | P3 | 3-4h |
| 7. Hardcoded Sanity ID | HIGH | Simple | Low | Config exposure | P2 | 1h |

**Total Estimated Time**: 16-20 hours (dev + testing)

---

## CRITICAL ISSUE #1: setInterval in Serverless API Route

### Current Problem

**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts` (lines 16-26)

```typescript
// THIS CRASHES VERCEL SERVERLESS FUNCTIONS
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
```

**Why It Fails**:
- Serverless functions are stateless and short-lived (typically 10-60 seconds max execution time)
- setInterval expects a long-running process
- Memory is not shared between invocations
- Each cold start creates a new timer, causing timer leaks

**Current Impact**:
- Function crashes on Vercel
- Rate limiting ineffective (memory resets between invocations)
- Unpredictable behavior in production

### Solution Analysis

#### Option A: Vercel KV (RECOMMENDED)

**Pros**:
- Native Vercel integration (zero config for existing Vercel projects)
- Serverless-native with automatic scaling
- Built-in TTL (Time To Live) support - perfect for rate limiting
- Generous free tier: 30,000 commands/day, 256MB storage
- Low latency (edge-optimized)
- No separate account needed (uses Vercel account)

**Cons**:
- Vercel platform lock-in
- Paid plans start at $20/month for higher usage
- Requires @vercel/kv package

**Cost**: FREE for this use case (well under 30k requests/day)

**Implementation Complexity**: LOW (2-3 hours)

#### Option B: Upstash Redis

**Pros**:
- Serverless-native Redis
- Better free tier: 10,000 commands/day
- Platform-agnostic (works on any platform)
- Standard Redis API (easier migration)
- Good documentation and community support

**Cons**:
- Requires separate Upstash account
- Slightly more complex setup (API keys, endpoints)
- Additional external dependency

**Cost**: FREE for this use case

**Implementation Complexity**: MEDIUM (3-4 hours)

#### Option C: In-Memory with Lazy Cleanup (NOT RECOMMENDED)

**Pros**:
- No external dependencies
- Zero cost
- Works offline in development

**Cons**:
- Memory resets between cold starts (ineffective rate limiting)
- Can't track rate limits across multiple serverless instances
- Only works for very low traffic or local dev
- Doesn't solve the core problem

**Implementation Complexity**: LOW (1-2 hours)
**Effectiveness**: LOW - Does not provide reliable rate limiting

#### Option D: Edge Middleware Rate Limiting

**Pros**:
- Runs at edge (before API route)
- Better performance (blocks requests earlier)
- Shared state across edge functions
- Can use Vercel KV or Upstash

**Cons**:
- More complex architecture
- Requires middleware setup
- Still needs KV/Redis for state

**Implementation Complexity**: MEDIUM-HIGH (4-5 hours)

### RECOMMENDED SOLUTION: Vercel KV

**Rationale**:
1. Native Vercel integration (project already on Vercel)
2. Lowest implementation complexity
3. Built-in TTL perfect for rate limiting
4. Free for this use case
5. Best performance on Vercel platform

### Implementation Steps

#### Step 1: Install Vercel KV (15 min)

```bash
cd /Users/michaelevans/DOA/doa-website
npm install @vercel/kv
```

#### Step 2: Configure Vercel KV (15 min)

1. Go to Vercel Dashboard → Project → Storage → Create KV Database
2. Name it: `doa-rate-limit`
3. Vercel automatically injects environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. No changes to `.env.local` needed (auto-injected in production)
5. For local dev, pull env vars: `vercel env pull`

#### Step 3: Create Rate Limiting Utility (45 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/lib/rateLimit.ts`

```typescript
import { kv } from '@vercel/kv'

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  limit: number    // Max requests per window
}

/**
 * Serverless-compatible rate limiting using Vercel KV
 * Uses sliding window algorithm for accurate rate limiting
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining attempts
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 3600000, limit: 5 } // Default: 5 per hour
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const windowStart = now - config.interval

  try {
    // Use Redis sorted set with timestamps as scores
    // This implements a sliding window algorithm

    // 1. Remove old entries outside the time window
    await kv.zremrangebyscore(key, 0, windowStart)

    // 2. Count requests in current window
    const count = await kv.zcard(key)

    if (count >= config.limit) {
      // Get oldest request timestamp to calculate retry-after
      const oldestTimestamps = await kv.zrange(key, 0, 0, { withScores: true })
      const oldestTimestamp = oldestTimestamps.length > 0 ? Number(oldestTimestamps[1]) : now
      const retryAfter = Math.ceil((oldestTimestamp + config.interval - now) / 1000)

      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset: oldestTimestamp + config.interval,
        retryAfter: retryAfter > 0 ? retryAfter : 1
      }
    }

    // 3. Add current request timestamp
    await kv.zadd(key, { score: now, member: `${now}:${Math.random()}` })

    // 4. Set TTL to cleanup key after window expires (prevent memory leak)
    await kv.expire(key, Math.ceil(config.interval / 1000))

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - count - 1,
      reset: now + config.interval
    }

  } catch (error) {
    // If KV is unavailable, fail open (allow request) to prevent breaking the API
    // Log error for monitoring
    console.error('Rate limiting error:', error)

    return {
      success: true, // Fail open
      limit: config.limit,
      remaining: config.limit,
      reset: now + config.interval
    }
  }
}

/**
 * Clear rate limit for a specific identifier (admin use)
 */
export async function clearRateLimit(identifier: string): Promise<void> {
  const key = `rate_limit:${identifier}`
  await kv.del(key)
}
```

#### Step 4: Update API Route (30 min)

**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`

Remove lines 12-26 (old rate limiting code) and replace with:

```typescript
import { rateLimit } from '@/lib/rateLimit'

// Remove these lines:
// const submissionTimestamps = new Map<string, number[]>()
// setInterval(() => { ... }, 3600000)
// function getRateLimitStatus(ip: string) { ... }

// In the POST function, replace rate limiting section (lines 60-77) with:

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

    // Check rate limit using Vercel KV
    const rateLimitResult = await rateLimit(ip, {
      interval: 3600000, // 1 hour
      limit: 5            // 5 requests per hour
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset)
          }
        }
      )
    }

    // Rest of the code remains the same...
    // (validation, email sending, etc.)
```

#### Step 5: Add Rate Limit Headers to Success Response (15 min)

Update the success response at the end of the POST function to include rate limit headers:

```typescript
// Return success response (update existing response around line 153)
return NextResponse.json(
  {
    success: true,
    message: 'Your message has been sent successfully!',
    data: {
      adminEmailId: adminEmailResult.data?.id,
      autoReplyId: autoReplyResult.data?.id,
    }
  },
  {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://doa-sable.vercel.app',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-RateLimit-Limit': String(rateLimitResult.limit),
      'X-RateLimit-Remaining': String(rateLimitResult.remaining),
      'X-RateLimit-Reset': String(rateLimitResult.reset)
    }
  }
)
```

#### Step 6: Write Tests (60 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/lib/__tests__/rateLimit.test.ts`

```typescript
import { rateLimit, clearRateLimit } from '../rateLimit'
import { kv } from '@vercel/kv'

// Mock Vercel KV
jest.mock('@vercel/kv', () => ({
  kv: {
    zremrangebyscore: jest.fn(),
    zcard: jest.fn(),
    zrange: jest.fn(),
    zadd: jest.fn(),
    expire: jest.fn(),
    del: jest.fn(),
  }
}))

describe('rateLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow request within limit', async () => {
    ;(kv.zcard as jest.Mock).mockResolvedValue(2)

    const result = await rateLimit('test-ip', { interval: 3600000, limit: 5 })

    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)
    expect(kv.zadd).toHaveBeenCalled()
  })

  it('should block request when limit exceeded', async () => {
    const now = Date.now()
    ;(kv.zcard as jest.Mock).mockResolvedValue(5)
    ;(kv.zrange as jest.Mock).mockResolvedValue(['key', now - 3000000])

    const result = await rateLimit('test-ip', { interval: 3600000, limit: 5 })

    expect(result.success).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(0)
    expect(kv.zadd).not.toHaveBeenCalled()
  })

  it('should cleanup old entries', async () => {
    ;(kv.zcard as jest.Mock).mockResolvedValue(1)

    await rateLimit('test-ip', { interval: 3600000, limit: 5 })

    expect(kv.zremrangebyscore).toHaveBeenCalled()
  })

  it('should fail open on KV errors', async () => {
    ;(kv.zcard as jest.Mock).mockRejectedValue(new Error('KV unavailable'))

    const result = await rateLimit('test-ip', { interval: 3600000, limit: 5 })

    expect(result.success).toBe(true)
    expect(result.remaining).toBe(5)
  })

  it('should set TTL on rate limit key', async () => {
    ;(kv.zcard as jest.Mock).mockResolvedValue(0)

    await rateLimit('test-ip', { interval: 3600000, limit: 5 })

    expect(kv.expire).toHaveBeenCalledWith('rate_limit:test-ip', 3600)
  })
})

describe('clearRateLimit', () => {
  it('should delete rate limit key', async () => {
    await clearRateLimit('test-ip')

    expect(kv.del).toHaveBeenCalledWith('rate_limit:test-ip')
  })
})
```

**Update**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/__tests__/route.test.ts`

Add test cases for rate limiting:

```typescript
describe('Rate Limiting', () => {
  it('should block after 5 requests within an hour', async () => {
    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      const response = await POST(mockRequest)
      expect(response.status).toBe(200)
    }

    // 6th request should be blocked
    const response = await POST(mockRequest)
    expect(response.status).toBe(429)

    const data = await response.json()
    expect(data.error).toContain('Too many requests')
    expect(data.retryAfter).toBeDefined()
  })

  it('should include rate limit headers', async () => {
    const response = await POST(mockRequest)

    expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
    expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
  })
})
```

### Testing Strategy

#### Local Testing (30 min)

1. Pull Vercel env vars: `vercel env pull`
2. Start dev server: `npm run dev`
3. Test contact form submission (use browser DevTools Network tab)
4. Verify rate limiting:
   - Submit 5 forms rapidly
   - 6th submission should return 429 status
   - Check response headers for rate limit info
5. Wait 1 hour or clear Redis key manually
6. Verify rate limit resets

#### Unit Tests (30 min)

```bash
npm test src/lib/__tests__/rateLimit.test.ts
npm test src/app/api/contact/__tests__/route.test.ts
```

#### Integration Testing (15 min)

```bash
# Run full test suite
npm test

# Should have no failures related to contact API
```

### Deployment Strategy

#### Phase 1: Create KV Database (5 min)
- Create KV database in Vercel dashboard
- Environment variables auto-injected

#### Phase 2: Deploy Code (10 min)
```bash
git add .
git commit -m "fix: replace setInterval with Vercel KV rate limiting"
git push origin main
```

#### Phase 3: Verify Production (15 min)
1. Check Vercel deployment logs
2. Test contact form on production site
3. Monitor Vercel KV dashboard for requests
4. Test rate limiting in production

### Rollback Strategy

If rate limiting fails:

1. **Immediate**: Deploy previous commit
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Temporary**: Disable rate limiting
   - Modify `rateLimit` function to always return `{ success: true }`
   - Deploy hotfix

3. **Alternative**: Switch to Upstash Redis
   - Takes 2-3 hours
   - Better than no rate limiting

### Success Criteria

- [ ] No setInterval in serverless functions
- [ ] Rate limiting works across serverless invocations
- [ ] 429 status returned after 5 requests per hour per IP
- [ ] Rate limit headers included in responses
- [ ] All tests passing
- [ ] No console errors in production
- [ ] Vercel KV dashboard shows request activity
- [ ] Contact form works normally for legitimate users
- [ ] No increased latency (< 50ms overhead)

### Monitoring

After deployment, monitor:

1. **Vercel KV Dashboard**: Check request count, latency
2. **Vercel Logs**: Look for rate limiting errors
3. **Contact Form Submissions**: Verify emails still sending
4. **Error Tracking**: No increase in API errors

---

## CRITICAL ISSUE #2: Test Endpoint Exposed in Production

### Current Problem

**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact-test/route.ts`

This test endpoint is publicly accessible in production:
- Accepts any POST data
- Logs all input to console (information disclosure)
- No authentication or environment checks
- Provides unnecessary attack surface

**Security Risk**:
- Could be used for reconnaissance
- Enables DoS attacks
- Information disclosure via console logs
- Wasted serverless function invocations

### Solution Approach

#### Option A: Delete the File (RECOMMENDED)

**Pros**:
- Simplest solution
- Zero attack surface
- No maintenance burden
- Forces use of real contact endpoint in tests

**Cons**:
- Need to update any tests that use it
- Lose quick debugging endpoint

**Implementation Time**: 15 minutes

#### Option B: Environment-Based Protection

**Pros**:
- Keep endpoint for local development
- Can enable in staging environments

**Cons**:
- Still exists in codebase
- Risk of misconfiguration
- Unnecessary complexity

**Implementation Time**: 30 minutes

### RECOMMENDED SOLUTION: Delete Test Endpoint

**Rationale**:
1. Real contact endpoint should be tested instead
2. Test endpoint provides no production value
3. Security through removal is better than protection
4. Simplifies codebase

### Implementation Steps

#### Step 1: Search for References (10 min)

```bash
cd /Users/michaelevans/DOA/doa-website
grep -r "contact-test" src/
grep -r "contact-test" tests/
```

#### Step 2: Update Tests if Needed (10 min)

If any tests use `/api/contact-test`, update them to use `/api/contact` with mocked Resend:

```typescript
// tests/contact-form.spec.ts (if it exists)
// Change from:
await page.request.post('/api/contact-test', { ... })

// To:
await page.request.post('/api/contact', { ... })
```

#### Step 3: Delete the File (1 min)

```bash
rm /Users/michaelevans/DOA/doa-website/src/app/api/contact-test/route.ts
```

#### Step 4: Run Tests (5 min)

```bash
npm test
npm run test:e2e
```

### Testing Strategy

1. **Verify Endpoint Removed**:
   ```bash
   curl https://your-domain.com/api/contact-test
   # Should return 404
   ```

2. **Verify Contact Form Still Works**:
   - Test real contact endpoint
   - Check e2e tests pass

3. **Check Build**:
   ```bash
   npm run build
   # Should succeed without errors
   ```

### Deployment Strategy

Include this fix in the same deployment as Issue #1 (they're both in API routes).

### Success Criteria

- [ ] `/api/contact-test` endpoint returns 404
- [ ] No references to `contact-test` in codebase
- [ ] All tests passing
- [ ] Production build successful

---

## CRITICAL ISSUE #3: Missing Content Security Policy

### Current Problem

**File**: `/Users/michaelevans/DOA/doa-website/next.config.ts`

Current security headers (lines 40-76) are good but missing **Content-Security-Policy**, the most important security header for preventing XSS attacks.

**Current Headers**:
- X-DNS-Prefetch-Control ✓
- Strict-Transport-Security ✓
- X-Frame-Options ✓
- X-Content-Type-Options ✓
- X-XSS-Protection ✓
- Referrer-Policy ✓
- Permissions-Policy ✓

**Missing**:
- **Content-Security-Policy** (CRITICAL)

**Security Risk**:
- XSS attacks possible
- Injection of malicious scripts
- Data exfiltration
- Clickjacking (beyond X-Frame-Options)

### Solution Approach

CSP is complex because it needs to allow:
1. Next.js inline scripts and styles
2. Sanity CDN images
3. Resend email tracking (if applicable)
4. Vercel Analytics
5. Any external fonts or resources

**Challenge**: Too strict = site breaks; too loose = ineffective

### Implementation Steps

#### Step 1: Audit Current External Resources (30 min)

Need to identify all external resources the site uses:

```bash
# Search for external URLs in code
cd /Users/michaelevans/DOA/doa-website
grep -r "https://" src/ --include="*.tsx" --include="*.ts" | grep -v "cdn.sanity.io" | grep -v "departmentofart.com"
```

Common resources for this project:
- `cdn.sanity.io` - Sanity images (already identified)
- `vercel.app` - Vercel deployment
- `fonts.googleapis.com` or similar - Web fonts (if used)
- `va.vercel-scripts.com` - Vercel Analytics

#### Step 2: Create CSP Configuration (45 min)

**File**: `/Users/michaelevans/DOA/doa-website/src/lib/csp.ts`

```typescript
/**
 * Content Security Policy configuration
 *
 * Defines allowed sources for different resource types.
 * Balance between security and functionality.
 */

export interface CSPDirectives {
  [key: string]: string[]
}

// Development CSP - More permissive for hot reload
export const developmentCSP: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'", // Required for Next.js dev mode
    "'unsafe-inline'", // Required for Next.js dev mode
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://cdn.sanity.io',
  ],
  'font-src': [
    "'self'",
    'data:',
  ],
  'connect-src': [
    "'self'",
    'https://vc89ievx.api.sanity.io', // Sanity API
    'http://localhost:*', // Dev server
    'ws://localhost:*', // Hot reload
  ],
  'media-src': [
    "'self'",
    'https://cdn.sanity.io',
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
}

// Production CSP - Strict security
export const productionCSP: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js inline scripts
    // Generate nonce in middleware for better security
    'https://va.vercel-scripts.com', // Vercel Analytics
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    // TODO: Consider using nonce for styles
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://cdn.sanity.io', // Sanity images
  ],
  'font-src': [
    "'self'",
    'data:',
  ],
  'connect-src': [
    "'self'",
    'https://vc89ievx.api.sanity.io', // Sanity API
    'https://va.vercel-scripts.com', // Vercel Analytics
  ],
  'media-src': [
    "'self'",
    'https://cdn.sanity.io',
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
  'block-all-mixed-content': [],
}

/**
 * Convert CSP directives object to header string
 */
export function generateCSPHeader(directives: CSPDirectives): string {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key
      }
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

/**
 * Get CSP header for current environment
 */
export function getCSPHeader(): string {
  const directives = process.env.NODE_ENV === 'production'
    ? productionCSP
    : developmentCSP

  return generateCSPHeader(directives)
}
```

#### Step 3: Update next.config.ts (15 min)

**File**: `/Users/michaelevans/DOA/doa-website/next.config.ts`

```typescript
import type { NextConfig } from "next";
import { getCSPHeader } from './src/lib/csp'

const nextConfig: NextConfig = {
  // ... existing image config ...

  // Security headers
  async headers() {
    // Generate CSP based on environment
    const cspHeader = getCSPHeader()

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ]
  },
};

export default nextConfig;
```

#### Step 4: Test CSP in Development (30 min)

1. Start dev server: `npm run dev`
2. Open browser DevTools → Console
3. Look for CSP violations
4. Check that:
   - Site loads correctly
   - Images from Sanity display
   - Styles apply correctly
   - No CSP errors in console

Common CSP errors and fixes:

| Error | Fix |
|-------|-----|
| Refused to load script from 'X' | Add domain to `script-src` |
| Refused to load style from 'X' | Add domain to `style-src` |
| Refused to load image from 'X' | Add domain to `img-src` |
| Refused to execute inline script | Add `'unsafe-inline'` (last resort) |

#### Step 5: Test CSP in Production Build (30 min)

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and check:
- All pages load
- No CSP violations
- Images work
- Styles work
- Analytics work (if enabled)

#### Step 6: CSP Reporting (Optional but Recommended) (30 min)

Add CSP violation reporting to catch issues in production:

```typescript
// In productionCSP object, add:
'report-uri': ['https://your-csp-report-endpoint.com/report'],
// Or use report-to with Reporting API
'report-to': ['csp-endpoint'],
```

For free CSP reporting:
- **Report URI**: https://report-uri.com (free tier)
- **Sentry**: Has CSP reporting built-in
- **Custom**: Create `/api/csp-report` endpoint

### Testing Strategy

#### CSP Validation Tools

1. **CSP Evaluator**: https://csp-evaluator.withgoogle.com
   - Paste CSP header
   - Get security score and recommendations

2. **Browser DevTools**:
   ```javascript
   // Check CSP in browser console
   console.log(document.querySelector('meta[http-equiv="Content-Security-Policy"]'))
   ```

3. **Security Headers Scanner**: https://securityheaders.com
   - Enter production URL
   - Should get A+ rating after fix

#### Manual Testing

Test each page:
- [ ] Homepage loads with images
- [ ] Projects page displays project images
- [ ] Contact form works
- [ ] About page loads
- [ ] Services page loads
- [ ] No console errors related to CSP

### Rollback Strategy

If CSP breaks the site:

1. **Quick Fix**: Add permissive directives
   ```typescript
   'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
   ```

2. **Disable CSP**: Comment out CSP header in next.config.ts
   ```typescript
   // {
   //   key: 'Content-Security-Policy',
   //   value: cspHeader
   // },
   ```

3. **Gradual Rollout**: Use CSP in report-only mode first
   ```typescript
   key: 'Content-Security-Policy-Report-Only',
   ```

### Success Criteria

- [ ] CSP header present in all responses
- [ ] No CSP violations in browser console
- [ ] Site fully functional (images, styles, scripts)
- [ ] Security scan shows A+ rating
- [ ] CSP Evaluator shows good score (> 80/100)
- [ ] All pages load without errors

---

## HIGH PRIORITY ISSUE #4: Console.log Statements in Production

### Current Problem

**Identified**: 37 console.log/error/warn occurrences across 18 files

**Files with Console Logs**:
- `/src/lib/metadata.ts` - 1 occurrence
- `/src/lib/utils.ts` - 2 occurrences
- `/src/contexts/SiteSettingsContext.tsx` - 1 occurrence
- `/src/utils/suppressConsoleWarnings.ts` - 6 occurrences (intentional)
- `/src/app/about/page.tsx` - 1 occurrence
- `/src/contexts/HomepageContext.tsx` - 1 occurrence
- `/src/app/services/page.tsx` - 1 occurrence
- `/src/app/api/revalidate/route.ts` - 8 occurrences
- `/src/app/api/contact-test/route.ts` - 3 occurrences (will be deleted)
- `/src/app/projects/page.tsx` - 1 occurrence
- `/src/app/contact/page.tsx` - 3 occurrences
- `/src/app/api/contact/route.ts` - 3 occurrences
- `/src/components/ClientLogos.tsx` - 1 occurrence
- `/src/components/Services.tsx` - 1 occurrence
- `/src/components/FaviconManager.tsx` - 1 occurrence
- `/src/components/Projects.tsx` - 1 occurrence
- `/src/app/clients/page.tsx` - 1 occurrence
- `/src/components/Testimonials.tsx` - 1 occurrence

**Issues**:
1. **Information Disclosure**: Console logs visible in production
2. **Performance**: Console operations have overhead
3. **Debugging**: Production issues harder to track without proper logging
4. **Security**: May expose sensitive data or API keys

### Solution Approach

**Note**: `next.config.ts` already has `removeConsole: process.env.NODE_ENV === 'production'` (line 33), which removes console.log but NOT console.error/warn/info.

Need a comprehensive strategy:
1. Keep critical error logs (console.error)
2. Remove debug logs (console.log)
3. Add proper production logging
4. Create debug utility for development

### Implementation Steps

#### Step 1: Create Logging Utility (30 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/lib/logger.ts`

```typescript
/**
 * Production-safe logging utility
 *
 * - Development: All logs to console
 * - Production: Only errors to console, debug logs suppressed
 * - Future: Can integrate with logging service (Sentry, Datadog, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  /**
   * Debug logs - only in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '')
    }
  }

  /**
   * Info logs - only in development
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '')
    }
  }

  /**
   * Warning logs - always logged
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '')
  }

  /**
   * Error logs - always logged
   * In production, consider sending to error tracking service
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorMessage = `[ERROR] ${message}`

    if (error instanceof Error) {
      console.error(errorMessage, {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        ...context
      })
    } else {
      console.error(errorMessage, error, context)
    }

    // TODO: Send to error tracking service in production
    // if (!this.isDevelopment) {
    //   Sentry.captureException(error, { extra: context })
    // }
  }

  /**
   * Create child logger with prefix
   */
  child(prefix: string): ChildLogger {
    return new ChildLogger(this, prefix)
  }
}

class ChildLogger {
  constructor(private parent: Logger, private prefix: string) {}

  debug(message: string, context?: LogContext): void {
    this.parent.debug(`[${this.prefix}] ${message}`, context)
  }

  info(message: string, context?: LogContext): void {
    this.parent.info(`[${this.prefix}] ${message}`, context)
  }

  warn(message: string, context?: LogContext): void {
    this.parent.warn(`[${this.prefix}] ${message}`, context)
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.parent.error(`[${this.prefix}] ${message}`, error, context)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for testing
export { Logger }
```

#### Step 2: Replace Console Logs (60 min)

Systematic replacement strategy:

**API Routes** (High Priority):
```typescript
// Before:
console.log('Contact form submission:', data)
console.error('Failed to send email:', error)

// After:
import { logger } from '@/lib/logger'

logger.debug('Contact form submission', { data })
logger.error('Failed to send email', error)
```

**React Components** (Medium Priority):
```typescript
// Before:
console.log('Fetching projects')
console.error('Failed to load:', error)

// After:
import { logger } from '@/lib/logger'

const componentLogger = logger.child('ProjectsPage')

componentLogger.debug('Fetching projects')
componentLogger.error('Failed to load projects', error)
```

**Utility Functions** (Low Priority):
```typescript
// Before:
console.warn('localStorage not available')

// After:
import { logger } from '@/lib/logger'

logger.warn('localStorage not available')
```

#### Step 3: Automated Replacement (30 min)

Create script to help with replacements:

**New File**: `/Users/michaelevans/DOA/scripts/replace-console-logs.sh`

```bash
#!/bin/bash

# Find and list all console.log statements (for review)
echo "Finding console.log statements..."
grep -rn "console\.log" doa-website/src --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "logger.ts"

echo ""
echo "Finding console.error statements..."
grep -rn "console\.error" doa-website/src --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "logger.ts"

echo ""
echo "Finding console.warn statements..."
grep -rn "console\.warn" doa-website/src --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "logger.ts"

echo ""
echo "Manual replacement required. Review each file and replace with logger utility."
```

#### Step 4: File-by-File Replacement (Grouped by Priority)

**Group 1: API Routes** (30 min)
- `/src/app/api/contact/route.ts`
- `/src/app/api/revalidate/route.ts`

**Group 2: Critical Components** (30 min)
- `/src/contexts/SiteSettingsContext.tsx`
- `/src/contexts/HomepageContext.tsx`

**Group 3: Other Files** (30 min)
- All remaining files

**Keep As-Is**:
- `/src/utils/suppressConsoleWarnings.ts` - Intentional console suppression

#### Step 5: Add ESLint Rule (15 min)

Prevent new console.logs from being added:

**File**: `/Users/michaelevans/DOA/doa-website/.eslintrc.json` (or .js)

```json
{
  "rules": {
    "no-console": ["warn", {
      "allow": ["warn", "error"]
    }]
  }
}
```

This allows `console.error` and `console.warn` but warns on `console.log`.

#### Step 6: Update next.config.ts (5 min)

**File**: `/Users/michaelevans/DOA/doa-website/next.config.ts`

Update compiler config to remove all console methods in production:

```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'] // Keep errors and warnings
  } : false,
},
```

### Testing Strategy

#### Development Testing
1. Start dev server
2. Verify logs still appear in console
3. Check that debug logs show with [DEBUG] prefix

#### Production Build Testing
```bash
npm run build
npm start
```

1. Open browser DevTools
2. Verify NO debug logs appear
3. Verify error logs still work (trigger an error)
4. Check build output for console removal confirmation

#### Verify Build Output
```bash
npm run build 2>&1 | grep -i "console"
```

Should show that console logs were removed.

### Success Criteria

- [ ] All `console.log` replaced with `logger.debug()`
- [ ] All `console.error` replaced with `logger.error()`
- [ ] ESLint warns on new console.log usage
- [ ] Production build removes debug logs
- [ ] Error logs still appear in production (for debugging)
- [ ] No performance degradation
- [ ] Logs have consistent format with prefixes

---

## HIGH PRIORITY ISSUE #5: No Error Boundaries

### Current Problem

**Identified**: No error boundary components found in codebase

**Risk**:
- Component errors crash entire app (white screen)
- No graceful degradation
- Poor user experience
- No error reporting
- Hard to debug production issues

**Common Scenarios That Need Error Boundaries**:
1. Sanity CMS fetch failures
2. Image loading errors
3. Component render errors
4. Third-party library errors
5. Network failures

### Solution Approach

Implement error boundaries at strategic levels:
1. **Root Error Boundary**: Catches all uncaught errors
2. **Page Error Boundaries**: Isolates page-level errors
3. **Component Error Boundaries**: Protects critical components
4. **API Error Handling**: Proper error responses

### Implementation Steps

#### Step 1: Create Root Error Boundary (45 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/app/error.tsx`

Next.js 15 App Router convention for error boundaries:

```typescript
'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    logger.error('Root error boundary caught error', error, {
      digest: error.digest,
      message: error.message,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-gray-400">
          We're sorry, but something unexpected happened. Our team has been notified.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-900 p-4 rounded-lg text-left">
            <p className="text-red-400 font-mono text-sm">
              {error.message}
            </p>
            {error.stack && (
              <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
```

#### Step 2: Create Global Error Boundary (30 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/app/global-error.tsx`

Catches errors in root layout:

```typescript
'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global error boundary caught error', error, {
      digest: error.digest,
    })
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-4xl font-bold">Critical Error</h1>
            <p className="text-gray-400">
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

#### Step 3: Create Reusable Error Boundary Component (45 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/components/ErrorBoundary.tsx`

For wrapping individual components:

```typescript
'use client'

import React, { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  name?: string
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Reusable error boundary component
 *
 * Usage:
 * <ErrorBoundary fallback={<ErrorFallback />} name="ProjectsSection">
 *   <Projects />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const boundaryName = this.props.name || 'Unknown'

    logger.error(
      `Error boundary caught error in ${boundaryName}`,
      error,
      {
        componentStack: errorInfo.componentStack,
      }
    )

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 text-sm">
            Unable to load this section. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4">
              <summary className="text-red-700 cursor-pointer text-sm">
                Error details
              </summary>
              <pre className="text-xs text-red-800 mt-2 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Functional wrapper for error boundary with reset capability
 */
export function ErrorBoundaryWithReset({
  children,
  fallback,
  name,
}: {
  children: ReactNode
  fallback?: (reset: () => void) => ReactNode
  name?: string
}) {
  const [resetKey, setResetKey] = React.useState(0)

  const reset = () => setResetKey(prev => prev + 1)

  const defaultFallback = (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-red-800 font-semibold mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 text-sm mb-4">
        Unable to load this section.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  )

  return (
    <ErrorBoundary
      key={resetKey}
      name={name}
      fallback={fallback ? fallback(reset) : defaultFallback}
    >
      {children}
    </ErrorBoundary>
  )
}
```

#### Step 4: Create Error Fallback Components (30 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/components/ErrorFallback.tsx`

```typescript
interface ErrorFallbackProps {
  error?: Error
  reset?: () => void
  title?: string
  message?: string
}

/**
 * Generic error fallback component
 */
export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  message = 'Unable to load this content. Please try again.',
}: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{message}</p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer text-sm font-semibold">
              Error details
            </summary>
            <pre className="text-xs mt-2 overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        {reset && (
          <button
            onClick={reset}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Compact error fallback for small sections
 */
export function CompactErrorFallback({ reset }: { reset?: () => void }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg text-center">
      <p className="text-sm text-gray-600 mb-2">Failed to load</p>
      {reset && (
        <button
          onClick={reset}
          className="text-sm text-blue-600 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}
```

#### Step 5: Wrap Critical Components (60 min)

Identify critical components that should have error boundaries:

**High Priority Components to Wrap**:
1. Projects section
2. Testimonials
3. Client logos
4. Contact form
5. Services section

**Example: Wrap Projects Component**

**File**: `/Users/michaelevans/DOA/doa-website/src/app/projects/page.tsx`

```typescript
import { ErrorBoundaryWithReset } from '@/components/ErrorBoundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import Projects from '@/components/Projects'

export default function ProjectsPage() {
  return (
    <ErrorBoundaryWithReset
      name="ProjectsPage"
      fallback={(reset) => (
        <ErrorFallback
          reset={reset}
          title="Failed to load projects"
          message="We're having trouble loading the projects. Please try again."
        />
      )}
    >
      <Projects />
    </ErrorBoundaryWithReset>
  )
}
```

**Example: Wrap Contact Form**

**File**: `/Users/michaelevans/DOA/doa-website/src/components/ContactForm.tsx` (if exists)

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function ContactFormWithErrorBoundary() {
  return (
    <ErrorBoundary
      name="ContactForm"
      fallback={
        <div className="p-6 bg-red-50 rounded-lg">
          <p className="text-red-800">
            The contact form is temporarily unavailable.
            Please email us directly at info@departmentofart.com
          </p>
        </div>
      }
    >
      <ContactForm />
    </ErrorBoundary>
  )
}
```

#### Step 6: Add Error Boundary Tests (45 min)

**New File**: `/Users/michaelevans/DOA/doa-website/src/components/__tests__/ErrorBoundary.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { ErrorBoundary, ErrorBoundaryWithReset } from '../ErrorBoundary'
import { ErrorFallback } from '../ErrorFallback'

// Component that throws error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress error console output in tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should render custom fallback', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('should call onError callback', () => {
    const onError = jest.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalled()
  })
})

describe('ErrorBoundaryWithReset', () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('should allow reset after error', () => {
    const { rerender } = render(
      <ErrorBoundaryWithReset>
        <ThrowError />
      </ErrorBoundaryWithReset>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const tryAgainButton = screen.getByText('Try again')
    tryAgainButton.click()

    // After reset, error boundary should re-render children
    // In real scenario, the component might not throw on second render
  })
})
```

### Testing Strategy

#### Manual Testing

1. **Test Root Error Boundary**:
   ```typescript
   // Temporarily add to a page
   throw new Error('Test error boundary')
   ```
   - Should show error page
   - Try again button should work
   - Go home link should work

2. **Test Component Error Boundary**:
   - Add error throw to Projects component
   - Only that section should fail
   - Rest of page should work

3. **Test Error Recovery**:
   - Trigger error
   - Click "Try again"
   - Verify component re-renders

#### Automated Testing

```bash
npm test -- ErrorBoundary
```

#### Production Testing

After deployment:
1. Monitor error reporting
2. Check that errors are caught (not white screen)
3. Verify user can still navigate site

### Success Criteria

- [ ] Root error boundary (`error.tsx`) catches page-level errors
- [ ] Global error boundary (`global-error.tsx`) catches root layout errors
- [ ] Reusable `ErrorBoundary` component available
- [ ] Critical components wrapped in error boundaries
- [ ] Error boundaries show user-friendly messages
- [ ] Reset/retry functionality works
- [ ] Errors logged to monitoring service
- [ ] Tests passing
- [ ] No white screens of death in production

---

## HIGH PRIORITY ISSUE #6: TypeScript any Types

### Current Problem

**Identified**: 2 files with `any` types (excluding test mocks):
- `/src/__mocks__/sanity/lib/image.ts` - Mock file (acceptable)
- `/src/__mocks__/sanity/lib/client.ts` - Mock file (acceptable)

**Good News**: Main source code appears to be well-typed!

However, let's do a comprehensive audit to find all uses of `any`:

### Solution Approach

1. Audit all `any` usages
2. Replace with proper types
3. Enable stricter TypeScript rules
4. Add ESLint rules to prevent `any`

### Implementation Steps

#### Step 1: Comprehensive any Audit (30 min)

```bash
cd /Users/michaelevans/DOA/doa-website

# Find all 'any' usages (including type annotations)
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "__mocks__"

# Find any[] usages
grep -rn ": any\[\]" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "__mocks__"

# Find 'as any' casts
grep -rn "as any" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "__mocks__"
```

#### Step 2: Review tsconfig.json (15 min)

**File**: `/Users/michaelevans/DOA/doa-website/tsconfig.json`

Enable stricter TypeScript checks:

```json
{
  "compilerOptions": {
    // Existing options...

    // Type checking strictness
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // Ensure proper imports
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### Step 3: Replace any with Proper Types (varies by file)

**Common any replacements**:

```typescript
// Before: any props
function Component(props: any) { }

// After: Proper interface
interface ComponentProps {
  title: string
  data: SomeType[]
}
function Component(props: ComponentProps) { }

// Before: any event
const handleClick = (e: any) => { }

// After: React event type
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { }

// Before: any API response
const data: any = await fetch('/api/endpoint').then(r => r.json())

// After: Type assertion or interface
interface ApiResponse {
  success: boolean
  data: SomeType
}
const data = await fetch('/api/endpoint').then(r => r.json()) as ApiResponse

// Or better: Runtime validation with Zod
const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SomeSchema)
})
const data = ApiResponseSchema.parse(await fetch('/api/endpoint').then(r => r.json()))

// Before: any error
catch (error: any) { }

// After: unknown with type guard
catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

#### Step 4: Add ESLint Rules (15 min)

**File**: `/Users/michaelevans/DOA/doa-website/.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn"
  }
}
```

#### Step 5: Type External Libraries (30 min)

If any external libraries lack types:

```bash
# Install type definitions
npm install --save-dev @types/library-name

# Or create custom types
# File: src/types/library-name.d.ts
declare module 'library-name' {
  export function someFunction(param: string): void
}
```

#### Step 6: Document Unavoidable any Uses (15 min)

If some `any` uses are truly unavoidable:

```typescript
// Use eslint-disable with justification
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValue: any = someThirdPartyLib.getDynamic()
// Justification: Third-party library returns truly dynamic types
```

### Testing Strategy

#### Type Check

```bash
# Run TypeScript compiler in check mode
npx tsc --noEmit

# Should show any type errors
```

#### Build Test

```bash
npm run build

# Should succeed without type errors
```

#### ESLint Check

```bash
npm run lint

# Should not show any 'any' type warnings
```

### Success Criteria

- [ ] No implicit `any` types in source code
- [ ] All function parameters properly typed
- [ ] All API responses properly typed
- [ ] Event handlers use React event types
- [ ] Error handling uses `unknown` instead of `any`
- [ ] ESLint rule enabled and passing
- [ ] TypeScript strict mode enabled
- [ ] Build succeeds without type errors

**Note**: If comprehensive audit finds no issues (as initial scan suggests), this task is mostly about enabling stricter rules and documentation. Estimated time: 2 hours.

---

## HIGH PRIORITY ISSUE #7: Hardcoded Sanity Project ID

### Current Problem

**File**: `/Users/michaelevans/DOA/sanity/lib/client.ts` (lines 5, 12, 22)

```typescript
const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vc89ievx').toString().trim()

// And later...
projectId: projectId === '' || !/^[a-z0-9-]+$/.test(projectId) ? 'vc89ievx' : projectId,
```

**Issues**:
1. **Security**: Project ID exposed in source code
2. **Configuration**: Hardcoded fallback prevents proper error handling
3. **Maintenance**: Multiple hardcoded values (potential drift)
4. **Best Practice**: Secrets should never have fallbacks

**Attack Vector**:
- Attackers can query public Sanity APIs with this project ID
- Can discover schema structure
- May access public documents

### Solution Approach

Two strategies:
1. **Remove fallback entirely** (RECOMMENDED for production)
2. **Use fallback only in development**

### Implementation Steps

#### Step 1: Remove Hardcoded Fallbacks (15 min)

**File**: `/Users/michaelevans/DOA/sanity/lib/client.ts`

```typescript
import { createClient } from 'next-sanity'
import { logger } from '@/lib/logger' // Add after creating logger utility

// Sanity configuration - NO fallbacks
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

// Validate required environment variables
if (!projectId) {
  const error = 'NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required'
  logger.error(error)
  throw new Error(error)
}

if (!dataset) {
  const error = 'NEXT_PUBLIC_SANITY_DATASET environment variable is required'
  logger.error(error)
  throw new Error(error)
}

// Validate project ID format
if (!/^[a-z0-9-]+$/.test(projectId)) {
  const error = `Invalid Sanity project ID format: ${projectId}`
  logger.error(error)
  throw new Error(error)
}

// Log configuration in development only
if (process.env.NODE_ENV === 'development') {
  logger.debug('Sanity configuration', {
    projectId,
    dataset,
    apiVersion: '2024-01-01',
  })
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
  perspective: 'published',
  token: undefined, // Don't use token for public queries
  stega: {
    enabled: process.env.NODE_ENV === 'development',
  },
})
```

#### Step 2: Update Environment Variables Documentation (15 min)

**File**: `/Users/michaelevans/DOA/doa-website/.env.example`

```bash
# Sanity Configuration
# REQUIRED: Get these from https://sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production

# Optional: Sanity API token for authenticated requests
# Only needed for preview mode or mutations
# SANITY_API_TOKEN=your_token_here

# Resend Configuration
# REQUIRED: Get from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Email Configuration
# REQUIRED: From email must be from verified domain in Resend
RESEND_FROM_EMAIL=contact@yourdomain.com
CONTACT_FORM_TO_EMAIL=info@yourdomain.com

# Optional: Site configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**File**: `/Users/michaelevans/DOA/doa-website/README.md` (update environment section)

Add prominent warning:

```markdown
## Environment Variables

### Required Variables

The following environment variables MUST be set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=contact@yourdomain.com
CONTACT_FORM_TO_EMAIL=info@yourdomain.com
```

**IMPORTANT**: The application will NOT start without these variables.

### Getting Sanity Credentials

1. Go to https://sanity.io/manage
2. Select your project
3. Copy the Project ID
4. Set dataset to `production` (or your preferred dataset)

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in all required variables
3. Run `npm run dev`
```

#### Step 3: Update Mock Clients for Tests (15 min)

Ensure tests don't fail due to missing env vars:

**File**: `/Users/michaelevans/DOA/doa-website/src/__mocks__/sanity/lib/client.ts`

```typescript
// Mock Sanity client for tests
export const client = {
  fetch: jest.fn(),
  config: jest.fn(() => ({
    projectId: 'test-project-id',
    dataset: 'test',
  })),
}
```

**File**: `/Users/michaelevans/DOA/doa-website/jest.setup.js` (or create if doesn't exist)

```javascript
// Set test environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
process.env.RESEND_API_KEY = 'test-key'
process.env.RESEND_FROM_EMAIL = 'test@example.com'
process.env.CONTACT_FORM_TO_EMAIL = 'test@example.com'
```

#### Step 4: Add Runtime Validation (Optional but Recommended) (30 min)

For extra safety, validate all environment variables at startup:

**New File**: `/Users/michaelevans/DOA/doa-website/src/lib/env.ts`

```typescript
/**
 * Environment variable validation
 *
 * Validates all required environment variables at startup.
 * Throws error if any are missing or invalid.
 */

interface EnvConfig {
  // Sanity
  sanityProjectId: string
  sanityDataset: string
  sanityToken?: string

  // Resend
  resendApiKey: string
  resendFromEmail: string
  contactFormToEmail: string

  // Site
  siteUrl: string

  // Environment
  nodeEnv: 'development' | 'production' | 'test'
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateSanityProjectId(projectId: string): boolean {
  return /^[a-z0-9-]+$/.test(projectId)
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

/**
 * Validate and export environment configuration
 *
 * Throws error if validation fails, preventing app from starting
 * with invalid configuration.
 */
export function validateEnv(): EnvConfig {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return {
      sanityProjectId: 'test-project',
      sanityDataset: 'test',
      resendApiKey: 'test-key',
      resendFromEmail: 'test@example.com',
      contactFormToEmail: 'test@example.com',
      siteUrl: 'http://localhost:3000',
      nodeEnv: 'test',
    }
  }

  // Validate Sanity configuration
  const sanityProjectId = getRequiredEnv('NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!validateSanityProjectId(sanityProjectId)) {
    throw new Error(`Invalid Sanity project ID format: ${sanityProjectId}`)
  }

  const sanityDataset = getRequiredEnv('NEXT_PUBLIC_SANITY_DATASET')

  // Validate Resend configuration
  const resendApiKey = getRequiredEnv('RESEND_API_KEY')
  if (!resendApiKey.startsWith('re_')) {
    throw new Error('Invalid Resend API key format')
  }

  const resendFromEmail = getRequiredEnv('RESEND_FROM_EMAIL')
  if (!validateEmail(resendFromEmail)) {
    throw new Error(`Invalid email format: ${resendFromEmail}`)
  }

  const contactFormToEmail = getRequiredEnv('CONTACT_FORM_TO_EMAIL')
  if (!validateEmail(contactFormToEmail)) {
    throw new Error(`Invalid email format: ${contactFormToEmail}`)
  }

  // Optional configuration
  const siteUrl = getOptionalEnv(
    'NEXT_PUBLIC_SITE_URL',
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://departmentofart.com'
  )

  return {
    sanityProjectId,
    sanityDataset,
    sanityToken: process.env.SANITY_API_TOKEN,
    resendApiKey,
    resendFromEmail,
    contactFormToEmail,
    siteUrl,
    nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
  }
}

// Validate on module import
export const env = validateEnv()
```

Then import at app startup:

**File**: `/Users/michaelevans/DOA/doa-website/src/app/layout.tsx`

```typescript
// Add at top of file
import { env } from '@/lib/env'

// Rest of file...
```

This ensures validation happens before anything else.

### Testing Strategy

#### Local Testing

1. **Remove .env.local**: Test that app fails without env vars
   ```bash
   mv .env.local .env.local.backup
   npm run dev
   # Should throw error about missing env vars
   mv .env.local.backup .env.local
   ```

2. **Invalid project ID**: Test validation
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=invalid@id npm run dev
   # Should throw error about invalid format
   ```

3. **Valid configuration**: Test normal operation
   ```bash
   npm run dev
   # Should start successfully
   ```

#### Build Testing

```bash
# Build without env vars (should fail)
npm run build

# Build with env vars (should succeed)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx npm run build
```

#### Test Suite

```bash
npm test
# Should pass with mocked env vars from jest.setup.js
```

### Deployment Verification

1. **Vercel Environment Variables**:
   - Check all required vars are set in Vercel dashboard
   - Re-deploy to ensure no build errors

2. **Runtime Check**:
   - Visit production site
   - Check for any console errors about missing env vars

### Success Criteria

- [ ] No hardcoded project IDs in source code
- [ ] App throws error if env vars missing
- [ ] Clear error messages for invalid configuration
- [ ] Documentation updated with env var requirements
- [ ] Tests use mocked env vars
- [ ] Production deployment successful
- [ ] No fallback values in code

---

## Implementation Order & Dependencies

### Phase 1: Foundation (Deploy Together)
**Time**: 4-5 hours
**Risk**: Low
**Deploy**: Single deployment

1. **Issue #7: Hardcoded Sanity ID** (1h)
   - No dependencies
   - Safe change
   - Can deploy independently

2. **Issue #4: Console.log Removal** (2h)
   - Requires logger utility
   - Safe change
   - Improves other fixes

3. **Issue #2: Remove Test Endpoint** (0.5h)
   - No dependencies
   - Quick win
   - Security improvement

### Phase 2: Critical Serverless Fix (Deploy Separately)
**Time**: 3-4 hours
**Risk**: Medium (rate limiting might have issues)
**Deploy**: Separate deployment with monitoring

4. **Issue #1: setInterval → Vercel KV** (3-4h)
   - BLOCKS production
   - Needs careful testing
   - Monitor after deployment
   - Rollback plan ready

### Phase 3: Security Headers (Deploy Separately)
**Time**: 2-3 hours
**Risk**: Medium (might break site if CSP too strict)
**Deploy**: Separate deployment, test thoroughly

5. **Issue #3: Content Security Policy** (2-3h)
   - Can break site if misconfigured
   - Test extensively before deploy
   - Consider report-only mode first

### Phase 4: Resilience (Deploy Together)
**Time**: 3-4 hours
**Risk**: Low
**Deploy**: Single deployment

6. **Issue #5: Error Boundaries** (3-4h)
   - Improves UX
   - Low risk
   - Can deploy with other changes

### Phase 5: Type Safety (Ongoing)
**Time**: 2-4 hours
**Risk**: Low (mostly enables future prevention)
**Deploy**: With other changes

7. **Issue #6: TypeScript any Types** (2-4h)
   - Low priority
   - Mostly preventative
   - Can be done incrementally

---

## Testing Checklist

Before deploying ANY fix:

### Automated Tests
- [ ] Unit tests pass: `npm test`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Build succeeds: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Type check passes: `npx tsc --noEmit`

### Manual Testing
- [ ] Dev server works: `npm run dev`
- [ ] Production build works: `npm start`
- [ ] Contact form submits successfully
- [ ] Images load from Sanity
- [ ] All pages render without errors
- [ ] Browser console has no errors

### Production Verification
- [ ] Deploy to staging first (if available)
- [ ] Test all critical user flows
- [ ] Monitor error rates after deployment
- [ ] Check Vercel logs for errors
- [ ] Verify analytics still working

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

If production breaks after deployment:

```bash
# Option 1: Vercel dashboard
# Go to Deployments → Click failed deployment → Redeploy previous

# Option 2: Git revert
git revert HEAD
git push origin main
# Vercel auto-deploys previous version
```

### Partial Rollback

If only one fix causes issues:

```bash
# Revert specific commit
git log --oneline  # Find commit hash
git revert <commit-hash>
git push origin main
```

### Emergency Hotfix

For critical issues that need immediate fix:

1. Create hotfix branch
2. Make minimal change
3. Deploy directly to production
4. Fix properly later

---

## Monitoring Post-Deployment

### Key Metrics to Watch

1. **Error Rate**
   - Check Vercel logs
   - Monitor error tracking service
   - Watch for spikes

2. **Performance**
   - Page load times
   - API response times
   - Rate limit effectiveness

3. **User Experience**
   - Contact form submissions
   - Image loading
   - Navigation working

4. **Security**
   - No XSS attempts succeeding
   - Rate limiting working
   - CSP violations (should be none)

### Monitoring Tools

1. **Vercel Dashboard**
   - Deployment status
   - Function logs
   - Analytics

2. **Vercel KV Dashboard** (after Issue #1 fix)
   - Request count
   - Latency
   - Memory usage

3. **Browser DevTools**
   - Console errors
   - Network requests
   - CSP violations

4. **SecurityHeaders.com**
   - Scan production URL
   - Verify A+ rating

---

## Documentation Updates Needed

After completing fixes, update:

1. **memory-bank/CURRENT.md**
   - Security fixes completed
   - New rate limiting approach
   - Error handling improvements

2. **memory-bank/SECURITY_DELIVERY_PLAN.md**
   - Mark issues as resolved
   - Add deployment dates
   - Document any deviations from plan

3. **doa-website/README.md**
   - Environment variable requirements
   - Error handling documentation
   - Rate limiting documentation

4. **CLAUDE.md** (if needed)
   - New utilities (logger, rate limiting)
   - Error boundary patterns
   - Testing patterns

---

## Cost Analysis

### Vercel KV Costs (Issue #1)

**Free Tier**:
- 30,000 commands per day
- 256 MB storage
- Unlimited databases

**Estimated Usage**:
- Contact form: ~1,000 submissions/month
- Rate limit checks: ~5 Redis commands per submission
- Total: ~5,000 commands/month
- **Cost: FREE** (well within free tier)

**Paid Tiers** (if needed later):
- Pro: $20/month (3M commands/day)
- Not needed for this use case

### Total Cost Impact

**All Fixes**: $0/month (all use free tiers or no external services)

---

## Risk Assessment Summary

| Risk Category | Likelihood | Impact | Mitigation |
|--------------|-----------|---------|------------|
| Rate limiting breaks contact form | Low | High | Thorough testing, fail-open strategy |
| CSP blocks legitimate resources | Medium | High | Report-only mode first, extensive testing |
| Error boundaries hide real errors | Low | Medium | Proper error logging, monitoring |
| Type errors break build | Low | High | Incremental changes, extensive testing |
| Vercel KV downtime | Low | Medium | Fail-open rate limiting, monitoring |
| Deployment breaks production | Low | Critical | Staged rollout, quick rollback plan |

---

## Timeline Estimate

### Aggressive Timeline (2 days)
- Day 1: Issues #1-4 (critical fixes)
- Day 2: Issues #5-7 (resilience & quality)

### Realistic Timeline (3-4 days)
- Day 1: Issues #7, #4, #2 (foundation)
- Day 2: Issue #1 (serverless fix + extensive testing)
- Day 3: Issue #3 (CSP + testing)
- Day 4: Issues #5-6 (error boundaries, types)

### Conservative Timeline (1 week)
- Mon: Planning & Issue #7
- Tue: Issues #4 & #2
- Wed: Issue #1 (full day for testing)
- Thu: Issue #3 (CSP testing)
- Fri: Issues #5-6
- Mon: Final testing & deployment

**Recommended**: Conservative timeline for production system

---

## Success Metrics

After all fixes deployed:

### Security
- [ ] SecurityHeaders.com score: A+
- [ ] CSP Evaluator score: > 80/100
- [ ] No test endpoints exposed
- [ ] No sensitive data in console logs
- [ ] No hardcoded credentials

### Reliability
- [ ] Rate limiting prevents abuse
- [ ] Error boundaries prevent white screens
- [ ] All API routes work in serverless
- [ ] Contact form 99%+ success rate

### Code Quality
- [ ] No TypeScript any types
- [ ] ESLint passes with no warnings
- [ ] All tests passing
- [ ] Type check passes

### User Experience
- [ ] Contact form works smoothly
- [ ] Site loads with all images
- [ ] No visible errors to users
- [ ] Graceful error messages

---

## Next Steps

1. **Review this plan** with team
2. **Allocate time** (3-4 days)
3. **Create backup** of production database
4. **Schedule deployment window** (low traffic time)
5. **Start with Phase 1** (foundation fixes)
6. **Deploy and monitor** each phase
7. **Update documentation** after completion

---

## Questions to Answer Before Starting

- [ ] Is there a staging environment for testing?
- [ ] What's the rollback SLA if production breaks?
- [ ] Who should be notified of deployments?
- [ ] Are there any other active feature branches?
- [ ] Should we create a security fixes branch or work on main?
- [ ] Is there a maintenance window we can use?
- [ ] Do we have access to production environment variables?
- [ ] Should we set up error tracking (Sentry) before starting?

---

## Contact Information

**Deployment Support**:
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Status: https://vercel-status.com
- Sanity Status: https://status.sanity.io

**Documentation**:
- Vercel KV Docs: https://vercel.com/docs/storage/vercel-kv
- Next.js Security Headers: https://nextjs.org/docs/advanced-features/security-headers
- React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

---

**Plan Version**: 1.0
**Last Updated**: 2025-10-15
**Status**: Ready for Implementation
