# Lighthouse Performance Optimization Plan
## LCP (Largest Contentful Paint) Fix

**Date**: October 20, 2025
**Current LCP**: 5.0s
**Target LCP**: < 2.0s
**Current Performance Score**: 76
**Target Score**: 90+

---

## Analysis Summary

### Root Cause Identified

The "OUR WORK" heading (LCP element) is inside the `Projects` client component that:
1. Waits for JavaScript to load
2. Waits for React to hydrate
3. Fetches data from Sanity CMS client-side via `useEffect`
4. Finally renders the heading

**Result**: 4,440ms render delay (88% of total LCP time)

### Key Metrics from Lighthouse

- **First Contentful Paint**: 1.5s ✅
- **Largest Contentful Paint**: 5.0s ❌ (5,040ms)
- **Total Blocking Time**: 60ms ✅
- **Cumulative Layout Shift**: 0 ✅
- **Speed Index**: 5.6s ⚠️

### LCP Breakdown

| Phase | % of LCP | Timing |
|-------|----------|--------|
| TTFB | 12% | 600ms |
| Load Delay | 0% | 0ms |
| Load Time | 0% | 0ms |
| **Render Delay** | **88%** | **4,440ms** ⚠️ |

---

## Phase 1: Convert to Server Components ⚡ CRITICAL

**Impact**: Reduce LCP by ~3-4 seconds
**Priority**: IMMEDIATE

### Problem
All data is fetched client-side in `useEffect`, blocking render. The entire homepage is wrapped in client components that prevent server-side rendering and streaming.

### Solution
Move to React Server Components with server-side data fetching.

### Changes Required

#### 1. Homepage (`src/app/page.tsx`)
```tsx
// BEFORE: Client-side wrapped
export default function Home() {
  return (
    <HomepageProvider>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <Projects /> {/* Client component fetching data */}
        <Services limit={4} />
        <ClientLogos />
        <Testimonials />
        <AboutCTA />
        <Footer />
      </div>
    </HomepageProvider>
  )
}

// AFTER: Server-side data fetching
export default async function Home() {
  // Fetch all data in parallel on server
  const [homepageSettings, projects, services, clients, testimonials] =
    await Promise.all([
      client.fetch(homepageSettingsQuery),
      client.fetch(featuredProjectsQuery),
      client.fetch(servicesQuery),
      client.fetch(clientsQuery),
      client.fetch(testimonialsQuery),
    ])

  return (
    <div className="min-h-screen">
      <Header />
      <Hero settings={homepageSettings} />
      <Projects projects={projects} sectionTitle={homepageSettings.sectionTitles?.featuredProjects} />
      <Services services={services} limit={4} />
      <ClientLogos clients={clients} />
      <Testimonials testimonials={testimonials} />
      <AboutCTA settings={homepageSettings.aboutCTA} />
      <Footer />
    </div>
  )
}
```

#### 2. Projects Component (`src/components/Projects.tsx`)

**Current Issue**: Entire component is `'use client'` with client-side data fetching

**Solution**: Split into server and client components

Create `src/components/Projects.tsx` (Server Component):
```tsx
// Server Component - renders immediately
import { client } from '../../sanity/lib/client'
import { featuredProjectsQuery } from '../../sanity/lib/queries'
import ProjectsClient from './ProjectsClient'

interface ProjectsProps {
  projects?: ProjectData[]
  sectionTitle: string
}

export default async function Projects({ projects, sectionTitle }: ProjectsProps) {
  // Fallback: fetch on server if not provided
  const projectsData = projects || await client.fetch(featuredProjectsQuery)

  return (
    <section className="py-20 bg-doa-black text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12 fade-in-up">
          {/* LCP element - rendered immediately on server */}
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
            {sectionTitle}
          </h2>
        </div>

        <ProjectsClient projects={projectsData} />
      </div>
    </section>
  )
}
```

Create `src/components/ProjectsClient.tsx` (Client Component):
```tsx
'use client'

import { useState } from 'react'
import ProjectsGrid from './ProjectsGrid'
import ProjectModal from './ProjectModal'
import { useProjectModal, type ProjectData } from '@/hooks/useProjectModal'

interface ProjectsClientProps {
  projects: ProjectData[]
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const modal = useProjectModal()

  if (projects.length === 0) {
    return <p className="text-gray-400">No projects available at the moment.</p>
  }

  return (
    <>
      <ProjectsGrid
        projects={projects}
        onProjectClick={modal.openModal}
        showViewAllCTA={true}
      />

      <ProjectModal
        project={modal.selectedProject}
        isOpen={modal.isModalOpen}
        onClose={modal.closeModal}
        currentImageIndex={modal.currentImageIndex}
        onNextImage={modal.nextImage}
        onPrevImage={modal.prevImage}
        onSelectImage={modal.selectImage}
      />
    </>
  )
}
```

#### 3. Other Components to Convert

Apply same pattern to:
- `src/components/Services.tsx` → `Services.tsx` + `ServicesClient.tsx` (if needed)
- `src/components/ClientLogos.tsx` → Server Component
- `src/components/Testimonials.tsx` → Server Component
- `src/components/AboutCTA.tsx` → Server Component

#### 4. Remove HomepageContext

`src/contexts/HomepageContext.tsx` - **DELETE** or refactor
- No longer needed with server-side data fetching
- Pass data via props instead

### Expected Impact
- LCP: 5.0s → ~2.0s (**60% improvement**)
- Render Delay: 4,440ms → < 500ms (**90% reduction**)
- Performance Score: 76 → 85+ (**+9 points**)

---

## Phase 2: Font Optimization 🔤 HIGH

**Impact**: Reduce LCP by 200-400ms
**Priority**: IMMEDIATE

### Problem
Bebas Neue font (used for LCP element) is not preloaded, causing delayed render.

### Solution
Add font preloading and optimization.

### Changes Required

#### 1. Update Layout (`src/app/layout.tsx`)

Add font preloading in `<head>`:
```tsx
<head>
  {/* Existing preloads */}
  <link
    rel="preload"
    as="image"
    href="/doa-logo.png"
    fetchPriority="high"
  />

  {/* NEW: Preload critical fonts */}
  <link
    rel="preload"
    href="/_next/static/media/bebas-neue-latin-400-normal.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />

  {/* DNS prefetch for external domains */}
  <link rel="dns-prefetch" href="https://cdn.sanity.io" />
  <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
</head>
```

**Note**: You'll need to find the actual font filename after build. Check `.next/static/media/` directory.

#### 2. Optimize Font Config (`src/lib/fonts.ts`)

```tsx
// Bebas Neue font - CRITICAL for LCP
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap", // Keep swap for critical font
  preload: true,    // NEW: Ensure preloading
  adjustFontFallback: true, // NEW: Reduce layout shift
});

// Non-critical fonts can use optional
const keaniaOne = Keania_One({
  weight: "400",
  variable: "--font-keania",
  subsets: ["latin"],
  display: "optional", // NEW: Don't block render
});
```

#### 3. Add Font Fallback CSS

Update `src/app/globals.css`:
```css
.bebas-font {
  font-family: var(--font-bebas);
  font-weight: 400;
  letter-spacing: 0.11em;
  /* NEW: Add similar fallback for better FOUT handling */
  font-display: swap;
}

/* NEW: Size-adjusted fallback to reduce layout shift */
@font-face {
  font-family: 'Bebas Fallback';
  src: local('Arial');
  size-adjust: 108%; /* Adjust to match Bebas Neue metrics */
  ascent-override: 95%;
  descent-override: 25%;
}
```

### Expected Impact
- Reduce TTFB contribution: 600ms → 400ms
- Faster font loading: -200-400ms
- Reduced layout shift with fallback

---

## Phase 3: Streaming & Suspense 🌊 MEDIUM

**Impact**: Improves perceived performance
**Priority**: SHORT-TERM

### Problem
User sees nothing until all JS loads and hydrates. No progressive rendering.

### Solution
Stream content progressively with React Suspense.

### Changes Required

#### 1. Add Loading UI (`src/app/loading.tsx`)

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-doa-black">
      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Skeleton for hero */}
        <div className="h-96 bg-zinc-900 rounded-lg animate-pulse mb-20" />

        {/* Skeleton for sections */}
        <div className="space-y-20">
          <div className="h-64 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-64 bg-zinc-900 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
```

#### 2. Update Homepage with Suspense (`src/app/page.tsx`)

```tsx
import { Suspense } from 'react'

export default async function Home() {
  // Fetch critical data first
  const homepageSettings = await client.fetch(homepageSettingsQuery)

  return (
    <div className="min-h-screen">
      <Header />
      <Hero settings={homepageSettings} />

      {/* Stream non-critical sections */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>

      <Suspense fallback={<ServicesSkeleton />}>
        <Services limit={4} />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <ClientLogos />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <Testimonials />
      </Suspense>

      <AboutCTA settings={homepageSettings.aboutCTA} />
      <Footer />
    </div>
  )
}
```

#### 3. Create Skeleton Components

`src/components/skeletons/ProjectsSkeleton.tsx`:
```tsx
export default function ProjectsSkeleton() {
  return (
    <section className="py-20 bg-doa-black text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <div className="h-16 w-64 mx-auto bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Expected Impact
- Faster First Contentful Paint
- Better perceived performance
- Progressive content loading

---

## Phase 4: Bundle Optimization 📦 MEDIUM

**Impact**: Reduces JS blocking time
**Priority**: SHORT-TERM

### Problem
Large JavaScript bundles block rendering. Heavy dependencies loaded upfront.

### Solution
Optimize code splitting and defer non-critical JS.

### Changes Required

#### 1. Dynamic Import Heavy Components

`src/components/ProjectsClient.tsx`:
```tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ProjectsGrid from './ProjectsGrid'
import { useProjectModal, type ProjectData } from '@/hooks/useProjectModal'

// Lazy load modal - not needed until user clicks
const ProjectModal = dynamic(() => import('./ProjectModal'), {
  ssr: false,
  loading: () => null
})

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const modal = useProjectModal()

  // Modal only loads when needed
  return (
    <>
      <ProjectsGrid
        projects={projects}
        onProjectClick={modal.openModal}
        showViewAllCTA={true}
      />

      {modal.isModalOpen && (
        <ProjectModal
          project={modal.selectedProject}
          isOpen={modal.isModalOpen}
          onClose={modal.closeModal}
          currentImageIndex={modal.currentImageIndex}
          onNextImage={modal.nextImage}
          onPrevImage={modal.prevImage}
          onSelectImage={modal.selectImage}
        />
      )}
    </>
  )
}
```

#### 2. Optimize Next.js Config (`next.config.ts`)

```tsx
import type { NextConfig } from "next";

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
    // NEW: Optimize package imports
    optimizePackageImports: [
      '@portabletext/react',
      '@sanity/image-url',
      '@react-email/components'
    ],
  },
  // NEW: Production optimizations
  swcMinify: true,
  compress: true,
};

export default nextConfig;
```

#### 3. Bundle Analysis

Add to `package.json`:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^15.0.0"
  }
}
```

Create `next.config.analyze.ts`:
```tsx
import withBundleAnalyzer from '@next/bundle-analyzer'
import nextConfig from './next.config.ts'

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
```

Run analysis:
```bash
npm install -D @next/bundle-analyzer
npm run analyze
```

### Expected Impact
- Smaller initial bundle
- Faster hydration
- Reduced Total Blocking Time

---

## Phase 5: Resource Hints & Preconnections 🔗 LOW

**Impact**: Small improvements (50-100ms)
**Priority**: NICE-TO-HAVE

### Problem
DNS lookup and connection delays to external resources.

### Solution
Enhanced resource hints (partially implemented, needs updates).

### Changes Required

Update `src/app/layout.tsx`:
```tsx
<head>
  {/* Critical resource preloads */}
  <link
    rel="preload"
    as="image"
    href="/doa-logo.png"
    fetchPriority="high"
  />
  <link
    rel="preload"
    href="/_next/static/media/bebas-neue-latin-400-normal.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />

  {/* DNS prefetch and preconnect for external domains */}
  <link rel="dns-prefetch" href="https://cdn.sanity.io" />
  <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />

  {/* NEW: Preconnect to Vercel Analytics */}
  <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

  {/* NEW: Prefetch for fonts.gstatic.com if using Google Fonts directly */}
  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
</head>
```

### Expected Impact
- Reduced network latency: -50-100ms
- Faster external resource loading

---

## Implementation Checklist

### ✅ Phase 1: Server Components (CRITICAL)
- [ ] Convert `src/app/page.tsx` to async server component
- [ ] Add parallel data fetching with `Promise.all`
- [ ] Split `Projects.tsx` into server + client components
- [ ] Convert `Services.tsx` to server component
- [ ] Convert `ClientLogos.tsx` to server component
- [ ] Convert `Testimonials.tsx` to server component
- [ ] Convert `AboutCTA.tsx` to server component
- [ ] Remove or refactor `HomepageContext.tsx`
- [ ] Test: Verify LCP element renders immediately
- [ ] Measure: Run Lighthouse, target LCP < 2.5s

### ⚡ Phase 2: Font Optimization (HIGH)
- [ ] Find Bebas Neue font filename in `.next/static/media/`
- [ ] Add font preload link in layout
- [ ] Update font config with `preload: true`
- [ ] Add font fallback CSS
- [ ] Test: Verify font loads without flash
- [ ] Measure: Run Lighthouse, check font timing

### 🌊 Phase 3: Streaming & Suspense (MEDIUM)
- [ ] Create `src/app/loading.tsx`
- [ ] Create skeleton components
- [ ] Wrap sections with Suspense boundaries
- [ ] Test: Verify progressive loading
- [ ] Measure: Check FCP improvement

### 📦 Phase 4: Bundle Optimization (MEDIUM)
- [ ] Dynamic import `ProjectModal`
- [ ] Update `next.config.ts` with optimizations
- [ ] Install and run bundle analyzer
- [ ] Identify large dependencies
- [ ] Optimize imports
- [ ] Test: Verify modal still works
- [ ] Measure: Check bundle size reduction

### 🔗 Phase 5: Resource Hints (LOW)
- [ ] Add missing preconnect/dns-prefetch links
- [ ] Test: Verify no broken resources
- [ ] Measure: Check network timing

---

## Testing & Validation

### Before Each Phase
```bash
# Run Lighthouse audit
npm run build
npm start
# Open Chrome DevTools → Lighthouse → Mobile → Performance
```

### After Each Phase
```bash
# 1. Build production
npm run build

# 2. Start production server
npm start

# 3. Run Lighthouse
# Record metrics in tracking sheet

# 4. Run bundle analysis (Phase 4)
npm run analyze
```

### Key Metrics to Track

| Metric | Baseline | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Target |
|--------|----------|---------|---------|---------|---------|--------|
| LCP | 5.0s | ? | ? | ? | ? | < 2.0s |
| FCP | 1.5s | ? | ? | ? | ? | < 1.5s |
| Speed Index | 5.6s | ? | ? | ? | ? | < 3.0s |
| TBT | 60ms | ? | ? | ? | ? | < 200ms |
| Performance | 76 | ? | ? | ? | ? | 90+ |

---

## Expected Final Results

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **LCP** | 5.0s | < 2.0s | **60-70% faster** |
| **Performance Score** | 76 | 90+ | **+14 points** |
| **Render Delay** | 4,440ms | < 500ms | **90% reduction** |
| **Speed Index** | 5.6s | < 3.0s | **45% faster** |
| **FCP** | 1.5s | < 1.2s | **20% faster** |

---

## Rollback Plan

If any phase causes issues:

1. **Git Safety**: Create branch before each phase
   ```bash
   git checkout -b perf/phase-1-server-components
   ```

2. **Incremental Commits**: Commit after each component conversion
   ```bash
   git add src/components/Projects.tsx src/components/ProjectsClient.tsx
   git commit -m "refactor: convert Projects to server component"
   ```

3. **Testing**: Test thoroughly before moving to next phase

4. **Rollback**: If issues occur
   ```bash
   git checkout main
   git branch -D perf/phase-1-server-components
   ```

---

## Notes

- All phases are independent and can be implemented separately
- Phase 1 has the biggest impact - prioritize this first
- Test on both mobile and desktop
- Use real device testing in addition to Lighthouse
- Monitor Core Web Vitals in production via Vercel Analytics

---

## References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Lighthouse Performance Guide](https://web.dev/lighthouse-performance/)
- [Web Vitals](https://web.dev/vitals/)
- [React Suspense](https://react.dev/reference/react/Suspense)
