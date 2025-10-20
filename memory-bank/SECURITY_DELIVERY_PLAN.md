# DOA Website Security Fixes - Comprehensive Delivery Plan

## Executive Summary

This delivery plan addresses 9 security issues identified in the DOA website security audit, organized into 4 implementation phases over an estimated 12-16 hours of work. The plan prioritizes critical security vulnerabilities first, followed by medium and low-priority improvements, with a focus on maintaining zero downtime and enabling safe rollback if issues arise.

**Timeline**: 2-3 days (with testing and deployment)
**Risk Level**: Medium (requires Next.js upgrade and API changes)
**Testing Strategy**: Unit, Integration, E2E, and Manual testing at each phase
**Deployment Approach**: Incremental Vercel deployments with preview environments

---

## Phase 1: Critical Security Fixes (Highest Priority)
**Duration**: 4-6 hours
**Risk**: Medium
**Can Deploy Independently**: Yes

### Task 1.1: Fix CORS Misconfiguration
**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
**Effort**: 30 minutes
**Dependencies**: None

**Changes Required**:
```typescript
// REMOVE lines 183-192 (entire OPTIONS function)
// ADD proper CORS headers to POST response only

// In POST function, after line 160, update response:
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
    }
  }
)
```

**Environment Variables Required**:
- Add `NEXT_PUBLIC_SITE_URL=https://www.doapdx.com` to Vercel environment variables (Production)
- Add `NEXT_PUBLIC_SITE_URL=https://doa-sable.vercel.app` to Vercel environment variables (Preview/Staging)
- Add `NEXT_PUBLIC_SITE_URL=http://localhost:3000` to `/Users/michaelevans/DOA/doa-website/.env.local` (Development)

**Testing**:
- Unit test: Verify POST response includes correct CORS headers
- Integration test: Verify OPTIONS requests are handled by Next.js defaults
- Manual test: Submit contact form from production domain
- Security test: Attempt CORS request from unauthorized domain

**Success Criteria**:
- CORS headers only allow configured origin
- Contact form still functions correctly
- No console CORS errors in browser

---

### Task 1.2: Add Security Headers to Next.js Config
**File**: `/Users/michaelevans/DOA/doa-website/next.config.ts`
**Effort**: 1 hour
**Dependencies**: None

**Changes Required**:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  // ADD security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
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
```

**Testing**:
- Build test: `npm run build` should succeed
- Header test: Use browser DevTools to verify headers in production
- Automated test: Create header validation test using Playwright
- Manual test: Test site functionality across all pages

**Success Criteria**:
- All security headers present in HTTP responses
- Site functions normally with new headers
- Build completes without errors
- Lighthouse security score improves

---

### Task 1.3: Upgrade Next.js to 15.5.4+
**File**: `/Users/michaelevans/DOA/doa-website/package.json`
**Effort**: 2-3 hours (including testing)
**Dependencies**: Should be done after 1.1 and 1.2 are tested

**Changes Required**:
```bash
# In package.json, update line 29:
"next": "15.5.4"
```

**Implementation Steps**:
1. Update package.json Next.js version
2. Run `npm install` to update dependencies
3. Run full test suite: `npm run test:all`
4. Test dev server: `npm run dev`
5. Test production build: `npm run build && npm start`
6. Check for breaking changes in Next.js 15.5.4 changelog
7. Update any deprecated API usage if found

**Testing**:
- Unit tests: `npm test` - all must pass
- E2E tests: `npm run test:e2e` - all must pass
- Manual testing: All pages, contact form, CMS integration
- Performance: Verify no regression in build time or bundle size

**Rollback Strategy**:
- Keep previous package-lock.json
- If issues arise: revert package.json and run `npm ci`
- Vercel automatically keeps previous deployments for instant rollback

**Success Criteria**:
- Next.js upgraded to 15.5.4
- All tests pass
- No console errors or warnings
- Site performance maintained or improved

---

## Phase 2: Medium Priority - Rate Limiting Enhancement
**Duration**: 3-4 hours
**Risk**: Medium
**Can Deploy Independently**: Yes (after Phase 1)

### Task 2.1: Implement Vercel Edge Config for Rate Limiting
**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
**Effort**: 2 hours
**Dependencies**: Requires Vercel Edge Config setup

**Implementation Approach**:

**Option A: Vercel KV (Recommended for Serverless)**
```typescript
// Install: npm install @vercel/kv

import { kv } from '@vercel/kv'

async function getRateLimitStatus(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Date.now()
  const key = `rate-limit:${ip}`
  const oneHourAgo = now - 3600000

  // Get recent submissions from KV
  const timestamps = await kv.get<number[]>(key) || []
  const recentSubmissions = timestamps.filter(t => t > oneHourAgo)

  // Allow max 5 submissions per hour per IP
  if (recentSubmissions.length >= 5) {
    const oldestTimestamp = recentSubmissions[0]
    const retryAfter = Math.ceil((oldestTimestamp + 3600000 - now) / 1000)
    return { allowed: false, retryAfter }
  }

  // Update timestamps
  recentSubmissions.push(now)
  await kv.set(key, recentSubmissions, { ex: 3600 }) // Expire after 1 hour

  return { allowed: true }
}

// REMOVE lines 12-43 (old in-memory implementation)
```

**Option B: Simple Serverless-Compatible Approach (No Additional Service)**
```typescript
// Use a combination of Vercel Edge Functions + request headers
// This is simpler but slightly less robust

function getRateLimitStatus(ip: string, headers: Headers): { allowed: boolean; retryAfter?: number } {
  // Use a combination of IP + timestamp in a hash
  // Store in a lightweight edge cache with short TTL
  // This is a simplified version that works without external DB

  const rateLimitKey = `X-RateLimit-${ip}`
  const existing = headers.get(rateLimitKey)

  // Implementation depends on edge runtime capabilities
  // May require Vercel Edge Config or similar

  return { allowed: true }
}
```

**Environment Variables Required** (for Option A):
- `KV_REST_API_URL` (auto-set by Vercel)
- `KV_REST_API_TOKEN` (auto-set by Vercel)

**Vercel Setup Steps**:
1. Go to Vercel Dashboard > Storage > Create KV Database
2. Link KV to project (environment variables auto-configured)
3. Deploy changes

**Testing**:
- Unit test: Mock KV client, test rate limiting logic
- Integration test: Test with actual KV in development
- Load test: Submit 6 requests from same IP, verify 6th is blocked
- Manual test: Verify rate limiting works in production

**Rollback Strategy**:
- Keep old in-memory implementation in git history
- If KV fails, temporarily increase rate limit threshold
- Monitor Vercel KV dashboard for errors

**Success Criteria**:
- Rate limiting works in serverless environment
- KV storage correctly tracks submissions
- Rate limit resets after 1 hour
- No increase in API response time (< 50ms overhead)

---

### Task 2.2: Enhance Input Validation
**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
**Effort**: 1.5 hours
**Dependencies**: None

**Changes Required**:
```typescript
// Install validator library: npm install validator
// Install types: npm install --save-dev @types/validator

import validator from 'validator'

// Replace lines 84-106 with enhanced validation:

// Validate required fields
if (!name || !email || !message) {
  return NextResponse.json(
    { error: 'Missing required fields' },
    { status: 400 }
  )
}

// Sanitize inputs
const sanitizedName = validator.trim(name)
const sanitizedEmail = validator.normalizeEmail(email) || ''
const sanitizedMessage = validator.trim(message)

// Validate name (2-100 characters, letters and spaces only)
if (!validator.isLength(sanitizedName, { min: 2, max: 100 })) {
  return NextResponse.json(
    { error: 'Name must be between 2 and 100 characters' },
    { status: 400 }
  )
}

if (!/^[a-zA-Z\s'-]+$/.test(sanitizedName)) {
  return NextResponse.json(
    { error: 'Name contains invalid characters' },
    { status: 400 }
  )
}

// Validate email format (enhanced)
if (!validator.isEmail(sanitizedEmail)) {
  return NextResponse.json(
    { error: 'Invalid email address' },
    { status: 400 }
  )
}

// Validate message length and content
if (!validator.isLength(sanitizedMessage, { min: 10, max: 5000 })) {
  return NextResponse.json(
    { error: 'Message must be between 10 and 5000 characters' },
    { status: 400 }
  )
}

// Check for potential spam patterns
if (/<script|javascript:|on\w+=/i.test(sanitizedMessage)) {
  return NextResponse.json(
    { error: 'Message contains invalid content' },
    { status: 400 }
  )
}

// Use sanitized values in email sending
const { name: _, email: __, message: ___, ...rest } = body
const validatedData = {
  name: sanitizedName,
  email: sanitizedEmail,
  message: sanitizedMessage
}
```

**Package Changes**:
```json
// Add to package.json dependencies:
"validator": "^13.11.0"

// Add to package.json devDependencies:
"@types/validator": "^13.11.8"
```

**Testing**:
- Unit tests: Test each validation rule individually
- Negative tests: Send malformed data, verify rejection
- XSS test: Send script tags, verify sanitization
- Boundary tests: Test min/max lengths
- Integration test: Verify valid submissions still work

**Success Criteria**:
- All input validated before processing
- XSS attempts blocked
- Helpful error messages for users
- Valid submissions still process correctly
- All tests pass

---

### Task 2.3: Add Google Maps URL Validation & Sandbox Attribute
**Files**:
- `/Users/michaelevans/DOA/doa-website/src/app/contact/page.tsx`
- `/Users/michaelevans/DOA/doa-website/src/lib/utils.ts` (create validator)

**Effort**: 1 hour
**Dependencies**: None

**Implementation**:

**Step 1: Create URL Validator** (`/Users/michaelevans/DOA/doa-website/src/lib/utils.ts`)
```typescript
// Add to existing utils.ts file:

export function isValidGoogleMapsUrl(url: string | undefined): boolean {
  if (!url) return false

  try {
    const parsedUrl = new URL(url)

    // Only allow Google Maps embed URLs
    const validHosts = [
      'www.google.com',
      'google.com',
      'maps.google.com',
      'www.google.co.uk',
      'google.co.uk'
    ]

    if (!validHosts.includes(parsedUrl.hostname)) {
      return false
    }

    // Must be an embed URL
    if (!parsedUrl.pathname.includes('/maps/embed')) {
      return false
    }

    // Must use HTTPS
    if (parsedUrl.protocol !== 'https:') {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}
```

**Step 2: Update Contact Page** (lines 250-263)
```typescript
import { isValidGoogleMapsUrl } from '@/lib/utils'

// Replace lines 250-263:
{pageData?.studioInfo?.showMap !== false && (
  <div className="h-96 bg-zinc-900 rounded-lg overflow-hidden">
    {isValidGoogleMapsUrl(pageData?.studioInfo?.googleMapsUrl || siteSettings?.address?.googleMapsUrl) ? (
      <iframe
        src={pageData?.studioInfo?.googleMapsUrl || siteSettings?.address?.googleMapsUrl || ""}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        sandbox="allow-scripts allow-same-origin"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale"
        title="Office Location Map"
      />
    ) : (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Map unavailable</p>
      </div>
    )}
  </div>
)}
```

**Testing**:
- Unit test: Test `isValidGoogleMapsUrl` with valid/invalid URLs
- Visual test: Verify map still displays correctly
- Security test: Attempt to use malicious URL, verify rejection
- Manual test: Test on multiple browsers

**Success Criteria**:
- Only valid Google Maps URLs render
- Sandbox attribute prevents malicious scripts
- Map still displays and functions correctly
- Fallback UI shows for invalid URLs

---

## Phase 3: Low Priority - Error Logging & ESLint
**Duration**: 2-3 hours
**Risk**: Low
**Can Deploy Independently**: Yes

### Task 3.1: Reduce Verbose Error Logging
**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts`
**Effort**: 30 minutes
**Dependencies**: None

**Changes Required**:
```typescript
// Replace lines 163-178 with safer logging:

} catch (error) {
  // Log error securely (don't expose details to client)
  if (process.env.NODE_ENV === 'development') {
    console.error('Contact form submission error:', error)
  } else {
    // In production, log only essential info
    console.error('Contact form error:', error instanceof Error ? error.message : 'Unknown error')
  }

  // Check if it's a Resend API error
  if (error instanceof Error && error.message.includes('API key')) {
    return NextResponse.json(
      { error: 'Email service configuration error. Please try again later.' },
      { status: 500 }
    )
  }

  // Generic error message to client (don't expose internals)
  return NextResponse.json(
    { error: 'Failed to send message. Please try again later.' },
    { status: 500 }
  )
}
```

**Testing**:
- Unit test: Verify error messages don't leak sensitive data
- Manual test: Trigger error, verify client sees generic message
- Log review: Verify production logs are concise

**Success Criteria**:
- Production logs don't expose sensitive data
- Clients see helpful but generic error messages
- Development logging remains detailed for debugging

---

### Task 3.2: Update ESLint Plugin (if vulnerable version found)
**File**: `/Users/michaelevans/DOA/doa-website/package.json`
**Effort**: 1 hour
**Dependencies**: None

**Note**: Current scan shows no `eslint-plugin-security` installed. This task is conditional.

**If Vulnerability Found**:
```bash
# Check for vulnerabilities
npm audit

# Update specific package
npm update eslint-plugin-security

# Or update all dependencies
npm update
```

**Testing**:
- Run `npm audit` to verify fix
- Run `npm run lint` to ensure linting still works
- Run full test suite: `npm run test:all`

**Success Criteria**:
- No ESLint vulnerabilities in `npm audit`
- Linting works correctly
- All tests pass

---

## Phase 4: Testing & Documentation
**Duration**: 2-3 hours
**Risk**: Low
**Can Deploy Independently**: No (validation phase)

### Task 4.1: Create Comprehensive Security Tests
**Files**: Create new test files
**Effort**: 2 hours
**Dependencies**: All previous tasks completed

**Test Files to Create**:

**1. `/Users/michaelevans/DOA/doa-website/src/app/api/contact/__tests__/security.test.ts`**
```typescript
import { POST, OPTIONS } from '../route'
import { NextRequest } from 'next/server'

describe('Contact API Security', () => {
  describe('CORS Protection', () => {
    it('should only allow configured origin', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Origin': 'https://malicious-site.com'
        }
      })

      const response = await POST(request)
      const corsHeader = response.headers.get('Access-Control-Allow-Origin')

      expect(corsHeader).not.toBe('*')
      expect(corsHeader).toBe(process.env.NEXT_PUBLIC_SITE_URL)
    })
  })

  describe('Input Validation', () => {
    it('should reject XSS attempts in message', async () => {
      // Test implementation
    })

    it('should sanitize email addresses', async () => {
      // Test implementation
    })

    it('should reject invalid name formats', async () => {
      // Test implementation
    })
  })

  describe('Rate Limiting', () => {
    it('should block after 5 submissions from same IP', async () => {
      // Test implementation
    })
  })
})
```

**2. `/Users/michaelevans/DOA/doa-website/tests/e2e/security.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Security E2E Tests', () => {
  test('should have security headers on all pages', async ({ page }) => {
    await page.goto('/')

    const response = await page.goto('/')
    const headers = response?.headers()

    expect(headers?.['x-frame-options']).toBe('SAMEORIGIN')
    expect(headers?.['x-content-type-options']).toBe('nosniff')
    expect(headers?.['strict-transport-security']).toContain('max-age')
  })

  test('should validate Google Maps iframe security', async ({ page }) => {
    await page.goto('/contact')

    const iframe = page.locator('iframe[src*="google.com/maps"]')
    await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin')
  })
})
```

**Testing**:
- Run new security tests: `npm test -- security.test.ts`
- Run E2E security tests: `npm run test:e2e tests/e2e/security.spec.ts`
- Verify all tests pass

---

### Task 4.2: Update Documentation
**Files**:
- `/Users/michaelevans/DOA/memory-bank/CURRENT.md`
- Create `/Users/michaelevans/DOA/doa-website/SECURITY.md`

**Effort**: 30 minutes
**Dependencies**: None

**Create Security Documentation** (`/Users/michaelevans/DOA/doa-website/SECURITY.md`):
```markdown
# Security Guidelines

## Security Measures Implemented

### 1. CORS Protection
- API endpoints only accept requests from configured origin
- No wildcard (*) CORS headers

### 2. Security Headers
All pages include:
- Strict-Transport-Security (HSTS)
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 3. Input Validation
Contact form validates:
- Email format and normalization
- Name length and character restrictions
- Message length and XSS prevention
- Spam pattern detection

### 4. Rate Limiting
- 5 submissions per hour per IP address
- Implemented with Vercel KV for serverless compatibility

### 5. Dependency Security
- Next.js kept up-to-date (15.5.4+)
- Regular security audits with `npm audit`

## Security Testing

Run security tests:
```bash
npm test -- security.test.ts
npm run test:e2e tests/e2e/security.spec.ts
```

## Reporting Security Issues

Email: security@departmentofart.com
```

**Update Memory Bank**:
- Document security fixes in `CURRENT.md`
- Add notes about new validation utilities

---

## Deployment Strategy

### Pre-Deployment Checklist
- [ ] All tests pass locally (`npm run test:all`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing completed on localhost
- [ ] Environment variables configured in Vercel
- [ ] Code reviewed and approved

### Deployment Phases

**Phase 1 Deployment** (Critical Fixes)
1. Create feature branch: `git checkout -b security/critical-fixes`
2. Implement Tasks 1.1, 1.2, 1.3
3. Run full test suite
4. Commit changes
5. Push to GitHub
6. Deploy to Vercel Preview environment
7. Test preview deployment thoroughly
8. Merge to main if successful
9. Monitor production for 24 hours

**Phase 2 Deployment** (Rate Limiting + Validation)
1. Create feature branch: `git checkout -b security/rate-limiting`
2. Set up Vercel KV in dashboard
3. Implement Tasks 2.1, 2.2, 2.3
4. Test with Vercel KV in preview
5. Deploy and monitor

**Phase 3 Deployment** (Logging + ESLint)
1. Create feature branch: `git checkout -b security/logging-improvements`
2. Implement Tasks 3.1, 3.2
3. Quick deploy (low risk)

**Phase 4 Deployment** (Tests + Docs)
1. Add to main codebase
2. Integrate into CI/CD

### Environment Variables Setup

**Add to Vercel Dashboard** (Project Settings > Environment Variables):

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.doapdx.com` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://doa-sable.vercel.app` | Preview/Staging |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Development |

**For KV Rate Limiting** (auto-configured by Vercel when KV is linked):
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### Rollback Procedures

**Vercel Instant Rollback**:
1. Go to Vercel Dashboard > Deployments
2. Find previous working deployment
3. Click "..." menu > "Promote to Production"
4. Rollback completes in seconds

**Manual Rollback**:
```bash
git revert <commit-hash>
git push origin main
# Vercel auto-deploys
```

**Emergency Rollback** (if API breaks):
1. Revert environment variables in Vercel
2. Deploy previous commit
3. Investigate issue in development

---

## Risk Assessment & Mitigation

### High Risk Items

| Risk | Mitigation Strategy | Rollback Plan |
|------|-------------------|---------------|
| Next.js upgrade breaks functionality | Comprehensive testing before deploy; gradual rollout | Instant Vercel rollback to 15.3.3 |
| CORS changes block legitimate traffic | Test from production domain before deploy; monitor analytics | Quick revert of CORS headers |
| Rate limiting blocks real users | Conservative limits (5/hour); monitor error rates | Increase limit or disable temporarily |
| KV dependency failure | Implement fallback to simple in-memory for single requests | Environment variable to toggle KV usage |

### Medium Risk Items

| Risk | Mitigation Strategy | Rollback Plan |
|------|-------------------|---------------|
| Validation too strict, blocks valid users | User testing before deploy; helpful error messages | Relax validation rules incrementally |
| Google Maps sandbox breaks functionality | Test in all browsers before deploy | Remove sandbox attribute |

### Low Risk Items

| Risk | Mitigation Strategy | Rollback Plan |
|------|-------------------|---------------|
| Error logging changes hide important issues | Compare logs before/after in staging | Revert logging changes |
| ESLint updates cause false positives | Review all lint warnings before deploy | Pin ESLint version |

---

## Success Metrics

### Security Metrics
- [ ] Zero `npm audit` vulnerabilities
- [ ] Security headers present on 100% of pages
- [ ] CORS only allows configured origin
- [ ] Rate limiting blocks 6th request from same IP
- [ ] Input validation blocks XSS attempts

### Performance Metrics
- [ ] API response time < 500ms (including validation)
- [ ] Rate limiting overhead < 50ms
- [ ] No increase in build time
- [ ] Lighthouse security score: 100

### Functional Metrics
- [ ] Contact form submission success rate > 98%
- [ ] Zero false positives in validation
- [ ] All existing tests pass
- [ ] New security tests achieve >90% coverage

---

## Timeline & Resource Allocation

### Day 1: Critical Security (Phase 1)
- **Morning** (3-4 hours): Tasks 1.1, 1.2, 1.3 implementation
- **Afternoon** (2 hours): Testing and first deployment
- **Evening**: Monitor production

### Day 2: Medium Priority (Phase 2)
- **Morning** (2-3 hours): Tasks 2.1, 2.2 implementation
- **Afternoon** (1-2 hours): Task 2.3 + testing
- **Evening**: Deploy and monitor

### Day 3: Low Priority & Validation (Phases 3-4)
- **Morning** (1-2 hours): Phase 3 implementation
- **Afternoon** (2-3 hours): Phase 4 comprehensive testing
- **Evening**: Final documentation and sign-off

---

## Dependencies & Prerequisites

### Before Starting
- [ ] Vercel access for environment variables
- [ ] Vercel KV database created and linked
- [ ] Git branch protection rules reviewed
- [ ] Backup of current `.env.local` file
- [ ] List of all deployment domains (prod, staging, preview)

### Tools Required
- Node.js 20+ (current version)
- npm (current version)
- Vercel CLI (optional, for local testing): `npm i -g vercel`
- Browser DevTools (for header inspection)

### Knowledge Requirements
- Next.js 15 App Router API routes
- Vercel deployment and environment variables
- TypeScript
- Security headers and CORS concepts
- Rate limiting strategies

---

## Post-Deployment Monitoring

### Week 1: Intensive Monitoring
- Check Vercel logs daily for errors
- Monitor contact form submission rates
- Check for rate limiting false positives
- Review security headers in production

### Week 2-4: Standard Monitoring
- Weekly review of Vercel analytics
- Monthly security audit: `npm audit`
- Quarterly dependency updates

### Alerts to Configure
- Vercel error rate > 5%
- Contact form submission failure rate > 2%
- Rate limiting blocks > 10% of requests
- Any 500 errors from `/api/contact`

---

## File Change Summary

### Files Modified (9 total)
1. `/Users/michaelevans/DOA/doa-website/src/app/api/contact/route.ts` - CORS, validation, rate limiting, logging
2. `/Users/michaelevans/DOA/doa-website/next.config.ts` - Security headers
3. `/Users/michaelevans/DOA/doa-website/package.json` - Dependencies (Next.js, validator, @vercel/kv)
4. `/Users/michaelevans/DOA/doa-website/src/app/contact/page.tsx` - Google Maps sandbox
5. `/Users/michaelevans/DOA/doa-website/src/lib/utils.ts` - URL validation utility
6. `/Users/michaelevans/DOA/doa-website/.env.local` - New environment variables

### Files Created (3 total)
7. `/Users/michaelevans/DOA/doa-website/src/app/api/contact/__tests__/security.test.ts` - Security unit tests
8. `/Users/michaelevans/DOA/doa-website/tests/e2e/security.spec.ts` - Security E2E tests
9. `/Users/michaelevans/DOA/doa-website/SECURITY.md` - Security documentation

---

## Quick Reference Commands

```bash
# Start development
cd /Users/michaelevans/DOA/doa-website
npm run dev

# Run tests
npm test                    # Unit tests
npm run test:e2e           # E2E tests
npm run test:all           # All tests

# Build and verify
npm run build
npm start

# Security checks
npm audit
npm audit fix

# Deploy to preview
git push origin feature-branch
# Vercel auto-deploys preview

# Check dependencies
npm outdated
npm update
```

---

This comprehensive delivery plan provides a structured, low-risk approach to implementing all security fixes with clear testing criteria, rollback strategies, and success metrics. Each phase can be deployed independently, allowing for incremental improvements without risking site stability.
