# Sanity Webhook Implementation Plan
## On-Demand Revalidation for Next.js 15

**Status**: Ready for Implementation
**Estimated Time**: 4-6 hours
**Priority**: High - Fixes stale content issue

---

## Problem Statement

Published changes in Sanity CMS are not appearing on the live site because:
- Next.js 15 caches pages indefinitely by default in production
- No revalidation settings configured on any pages
- Pages are statically generated at build time and never update

## Solution: Sanity Webhooks + On-Demand Revalidation

When content is published in Sanity:
1. Sanity sends webhook POST request to Next.js API route
2. API route verifies webhook signature for security
3. API route determines which pages are affected by the change
4. API route calls `revalidatePath()` to regenerate affected pages
5. Users see updated content immediately (no rebuild required)

---

## Architecture Overview

```
Sanity CMS (Publish)
    ↓
Webhook POST → /api/revalidate
    ↓
Signature Verification (HMAC-SHA256)
    ↓
Parse Document Type
    ↓
Map to Affected Routes
    ↓
revalidatePath() for each route
    ↓
Return 200 OK to Sanity
```

### Content Type → Route Mapping

| Content Type | Affected Routes |
|-------------|----------------|
| `project` | `/`, `/projects` |
| `service` | `/`, `/services` |
| `client` | `/`, `/clients` |
| `testimonial` | `/` |
| `homepageSettings` | `/` |
| `siteSettings` | All pages (via layout) |
| `servicesPage` | `/services` |
| `projectsPage` | `/projects` |
| `aboutPage` | `/about` |
| `contactPage` | `/contact` |
| `emailSettings` | No user-facing impact |
| `teamMember` | `/about` |

---

## Implementation Phases

### Phase 1: API Route Setup (1.5 hours)

**File**: `/Users/michaelevans/DOA/doa-website/src/app/api/revalidate/route.ts`

```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Content type to routes mapping
const ROUTE_MAP: Record<string, string[]> = {
  project: ['/', '/projects'],
  service: ['/', '/services'],
  client: ['/', '/clients'],
  testimonial: ['/'],
  homepageSettings: ['/'],
  siteSettings: ['/', '/projects', '/services', '/clients', '/about', '/contact'],
  servicesPage: ['/services'],
  projectsPage: ['/projects'],
  aboutPage: ['/about'],
  contactPage: ['/contact'],
  teamMember: ['/about'],
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = request.headers.get('sanity-webhook-signature')
    const body = await request.text()

    if (!signature || !verifySignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // 2. Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (isRateLimited(ip)) {
      console.error('Rate limit exceeded for IP:', ip)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // 3. Parse webhook payload
    const payload = JSON.parse(body)
    const documentType = payload._type || payload.result?._type

    if (!documentType) {
      console.error('No document type in webhook payload')
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // 4. Get affected routes
    const routes = ROUTE_MAP[documentType] || []

    if (routes.length === 0) {
      console.warn(`No routes configured for document type: ${documentType}`)
      return NextResponse.json({
        success: true,
        message: `No routes to revalidate for ${documentType}`,
      })
    }

    // 5. Revalidate all affected routes
    const revalidated: string[] = []
    for (const route of routes) {
      try {
        revalidatePath(route)
        revalidated.push(route)
        console.log(`✓ Revalidated: ${route}`)
      } catch (error) {
        console.error(`✗ Failed to revalidate ${route}:`, error)
      }
    }

    // 6. Return success response
    return NextResponse.json({
      success: true,
      documentType,
      revalidated,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Verify HMAC signature from Sanity
function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not configured')
    return false
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return signature === hash
}

// Simple rate limiting (60 requests per 5 minutes per IP)
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + 5 * 60 * 1000, // 5 minutes
    })
    return false
  }

  if (limit.count >= 60) {
    return true
  }

  limit.count++
  return false
}
```

**Testing Checklist**:
- [ ] API route responds to POST requests
- [ ] Signature verification works
- [ ] Invalid signatures are rejected
- [ ] Rate limiting triggers after 60 requests
- [ ] All content types map to correct routes
- [ ] Revalidation actually updates pages

---

### Phase 2: Environment Configuration (0.5 hours)

#### 2.1 Generate Webhook Secret

```bash
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.2 Add to Local Environment

**File**: `/Users/michaelevans/DOA/doa-website/.env.local`

```bash
SANITY_WEBHOOK_SECRET=your_generated_secret_here
```

#### 2.3 Add to Vercel

```bash
# Using Vercel CLI
vercel env add SANITY_WEBHOOK_SECRET

# Or via Vercel Dashboard:
# 1. Go to Project Settings → Environment Variables
# 2. Add SANITY_WEBHOOK_SECRET
# 3. Set value to your generated secret
# 4. Select all environments (Production, Preview, Development)
```

**Testing Checklist**:
- [ ] Secret generated and saved securely
- [ ] Local `.env.local` updated
- [ ] Vercel environment variable set
- [ ] Secret is accessible in API route

---

### Phase 3: Sanity Configuration (1 hour)

#### 3.1 Configure Webhook in Sanity Dashboard

1. Go to https://www.sanity.io/manage
2. Select your project (vc89ievx)
3. Navigate to **API** → **Webhooks**
4. Click **Create Webhook**

**Webhook Configuration**:
```
Name: Next.js Revalidation
Description: Trigger Next.js revalidation on content publish
URL: https://your-domain.vercel.app/api/revalidate
Dataset: production
Trigger on: Create, Update, Delete
HTTP method: POST
HTTP Headers: (none needed)
Secret: [paste your SANITY_WEBHOOK_SECRET]
API version: 2024-01-01
```

#### 3.2 Webhook Payload Structure

Sanity will send:
```json
{
  "_id": "document-id",
  "_type": "project",
  "_rev": "revision-id",
  "result": {
    "_id": "document-id",
    "_type": "project",
    "_createdAt": "2024-10-09T...",
    "_updatedAt": "2024-10-09T...",
    // ... all document fields
  }
}
```

**Testing Checklist**:
- [ ] Webhook created in Sanity dashboard
- [ ] Secret matches environment variable
- [ ] Test webhook sends successfully
- [ ] Webhook appears in Sanity logs

---

### Phase 4: Page Configuration (1 hour)

Add fallback revalidation to all pages as backup:

#### Files to Modify:

1. **`/Users/michaelevans/DOA/doa-website/src/app/page.tsx`**
```typescript
// Add after imports, before component
export const revalidate = 300 // Revalidate every 5 minutes as fallback
```

2. **`/Users/michaelevans/DOA/doa-website/src/app/projects/page.tsx`**
```typescript
export const revalidate = 300
```

3. **`/Users/michaelevans/DOA/doa-website/src/app/services/page.tsx`**
```typescript
export const revalidate = 300
```

4. **`/Users/michaelevans/DOA/doa-website/src/app/clients/page.tsx`**
```typescript
export const revalidate = 300
```

5. **`/Users/michaelevans/DOA/doa-website/src/app/about/page.tsx`**
```typescript
export const revalidate = 300
```

6. **`/Users/michaelevans/DOA/doa-website/src/app/contact/page.tsx`**
```typescript
export const revalidate = 300
```

7. **`/Users/michaelevans/DOA/doa-website/src/app/layout.tsx`**
```typescript
export const revalidate = 300
```

8. **`/Users/michaelevans/DOA/doa-website/src/app/projects-preview/page.tsx`** (if applicable)
```typescript
export const revalidate = 300
```

**Why Fallback Revalidation?**
- Ensures content updates even if webhooks fail
- Catches edge cases (manual database edits, etc.)
- 5 minutes is reasonable for most content
- Webhooks will trigger instant updates, this is just backup

**Testing Checklist**:
- [ ] All pages have `export const revalidate = 300`
- [ ] No TypeScript errors
- [ ] Build succeeds locally
- [ ] Pages show revalidation timing in Vercel logs

---

### Phase 5: Testing (1.5 hours)

#### 5.1 Local Testing with ngrok

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok tunnel
npx ngrok http 3002

# Copy ngrok HTTPS URL (e.g., https://abc123.ngrok.io)
# Configure temporary webhook in Sanity pointing to:
# https://abc123.ngrok.io/api/revalidate
```

**Test Cases**:
1. Publish a new project → Check `/` and `/projects` update
2. Update a service → Check `/` and `/services` update
3. Delete a client → Check `/` and `/clients` update
4. Update homepage settings → Check `/` updates
5. Update site settings → Check all pages update

#### 5.2 Production Testing

```bash
# Deploy to Vercel
git add .
git commit -m "Add Sanity webhook revalidation"
git push

# Update Sanity webhook URL to production domain
# Test each content type as above
```

#### 5.3 Edge Case Testing

- [ ] Invalid signature rejected
- [ ] Missing signature rejected
- [ ] Malformed payload handled gracefully
- [ ] Rate limiting triggers correctly
- [ ] Unknown document types handled
- [ ] Rapid successive updates work

#### 5.4 Monitoring

Check Vercel logs for:
```
✓ Revalidated: /
✓ Revalidated: /projects
```

Check Sanity webhook logs for:
- Delivery status (200 OK)
- Response time
- Failure reasons (if any)

**Testing Checklist**:
- [ ] Local testing successful with ngrok
- [ ] Production webhook configured
- [ ] All content types trigger revalidation
- [ ] Pages update immediately after publish
- [ ] Error cases handled properly
- [ ] Logs show successful revalidation

---

### Phase 6: Documentation (0.5 hours)

#### 6.1 Update Memory Bank

Add to `CURRENT.md`:
```markdown
## Sanity Webhooks

- **Status**: Active
- **Endpoint**: `/api/revalidate`
- **Security**: HMAC-SHA256 signature verification
- **Rate Limit**: 60 requests per 5 minutes per IP
- **Fallback**: 5-minute time-based revalidation on all pages

### Content Updates
Changes published in Sanity trigger immediate revalidation:
- Projects → `/`, `/projects`
- Services → `/`, `/services`
- Clients → `/`, `/clients`
- All settings → Respective pages

### Troubleshooting
- Check Sanity webhook logs for delivery status
- Check Vercel logs for revalidation messages
- Verify SANITY_WEBHOOK_SECRET matches in both systems
```

#### 6.2 Team Documentation

Create quick reference:
```markdown
## Publishing Content

1. Make changes in Sanity Studio
2. Click "Publish"
3. Changes appear on live site within seconds
4. If not, check:
   - Sanity webhook logs (successful delivery?)
   - Vercel function logs (revalidation triggered?)
   - Wait 5 minutes for fallback revalidation
```

**Testing Checklist**:
- [ ] Memory bank updated
- [ ] Team documentation created
- [ ] Troubleshooting guide added

---

## Success Metrics

### Before Implementation
- Content updates require full rebuild (~5 minutes)
- Manual deployment needed for any change
- Client frustration with stale content

### After Implementation
- Content updates appear within seconds
- No manual intervention required
- Automatic fallback every 5 minutes
- Secure, verified webhook calls only

---

## Rollback Plan

If webhooks cause issues:

```typescript
// Temporarily disable webhook revalidation
// In /src/app/api/revalidate/route.ts
export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'Webhook revalidation temporarily disabled'
  }, { status: 503 })
}

// Or delete webhook in Sanity dashboard
// Pages will still update every 5 minutes via fallback
```

---

## Future Enhancements

1. **Tag-Based Revalidation**
   - Use `revalidateTag()` instead of `revalidatePath()`
   - More granular control over what gets revalidated

2. **Webhook Logging Dashboard**
   - Track webhook deliveries
   - Monitor revalidation performance
   - Alert on failures

3. **Redis Rate Limiting**
   - Replace in-memory rate limiting
   - Survive server restarts
   - Better distributed rate limiting

4. **Preview Mode**
   - Add draft content preview
   - Separate webhook for preview deployments

---

## Resources

- [Next.js Revalidation Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Sanity Webhooks Docs](https://www.sanity.io/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Ready to implement?** Start with Phase 1 and work through sequentially.
