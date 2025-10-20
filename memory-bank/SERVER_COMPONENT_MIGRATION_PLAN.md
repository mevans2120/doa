# Server Component Migration Plan

## Overview
Convert homepage from client-side rendering to Server Components to improve LCP from 4,970ms to ~1,500-2,500ms (60-70% improvement).

## Current Architecture Analysis

### Performance Problem
- **Current LCP:** 4,970ms
- **Render Delay:** 4,370ms (88% of LCP)
- **Root Cause:** Client-side data fetching waterfall
  - HTML loads → JS loads → HomepageContext fetches → Components render → Each component fetches → Finally renders LCP element

### Current Data Flow
```
Browser
  ↓
HomepageContext (client-side fetch)
  ↓
├─ Hero (uses context)
├─ Projects (client-side fetch + context)
├─ Services (client-side fetch)
├─ ClientLogos (client-side fetch)
├─ Testimonials (client-side fetch)
├─ AboutCTA (uses context)
└─ Footer (uses context)
```

## Target Architecture

### New Data Flow
```
Server (parallel fetches)
  ↓
Promise.all([
  homepageSettings,
  projects,
  services,
  clientLogos,
  testimonials
])
  ↓
Render complete HTML
  ↓
Browser receives fully rendered page
```

## Component Analysis

### Components Requiring Changes (8 total)

#### 1. **page.tsx** (Homepage)
- **Current:** Client component with HomepageProvider wrapper
- **After:** Server component with parallel data fetching
- **Complexity:** Medium
- **Changes:**
  - Add `async` to component
  - Fetch all data with `Promise.all()`
  - Pass data as props to child components
  - Remove HomepageProvider wrapper

#### 2. **Projects.tsx**
- **Current:** Client component with useState, useEffect, and modal
- **After:** Split into Server + Client parts
- **Complexity:** Medium
- **Client-side features to preserve:**
  - ProjectModal (interactive)
  - useProjectModal hook (state management)
  - onClick handlers
- **Server part:** Render section with data
- **Client part:** Interactive grid + modal

#### 3. **Services.tsx**
- **Current:** Client component with useState, useEffect
- **After:** Server component (no interactivity needed)
- **Complexity:** Low
- **Changes:**
  - Remove 'use client'
  - Remove useState, useEffect
  - Accept data as props
  - Keep limit prop functionality

#### 4. **ClientLogos.tsx**
- **Current:** Client component with useState, useEffect
- **After:** Server component
- **Complexity:** Low
- **Changes:**
  - Remove 'use client'
  - Remove useState, useEffect
  - Accept data as props

#### 5. **Testimonials.tsx**
- **Current:** Client component with useState, useEffect
- **After:** Server component
- **Complexity:** Low
- **Changes:**
  - Remove 'use client'
  - Remove useState, useEffect
  - Accept data as props

#### 6. **Hero.tsx**
- **Current:** Client component using HomepageContext
- **After:** Server component accepting props
- **Complexity:** Low
- **Changes:**
  - Remove 'use client'
  - Remove useHomepage hook
  - Accept settings as prop

#### 7. **AboutCTA.tsx**
- **Current:** Client component using HomepageContext
- **After:** Server component accepting props
- **Complexity:** Low
- **Changes:**
  - Remove 'use client'
  - Remove useHomepage hook
  - Accept settings as prop

#### 8. **Header.tsx**
- **Current:** Client component with useState (menu toggle) + SiteSettingsContext
- **After:** Split into Server + Client parts
- **Complexity:** Medium
- **Client-side features to preserve:**
  - Mobile menu toggle
  - Active route detection
  - onClick handlers
- **Server part:** Fetch settings, structure
- **Client part:** Interactive menu

#### 9. **Footer.tsx**
- **Current:** Client component using SiteSettingsContext
- **After:** Server component accepting props
- **Complexity:** Low
- **Changes:**
  - Remove 'use client'
  - Remove useSiteSettings hook
  - Accept settings as prop

### Components That Stay Client-Side (No Changes)

- **ProjectModal.tsx** - Modal interactions
- **ProjectsGrid.tsx** - Click handlers
- **FaviconManager.tsx** - Browser-only API
- **ConsoleSuppress.tsx** - Browser console manipulation
- **RichText.tsx** - Just a renderer, no state

### Context to Remove

- **HomepageContext.tsx** - Delete entire file
- **SiteSettingsContext.tsx** - May need to refactor or keep for other pages

## Migration Steps

### Phase 1: Preparation (30 min)
1. Create backup branch
2. Document current component props/interfaces
3. Identify all queries used
4. Review test coverage

### Phase 2: Data Fetching Layer (30 min)
1. Update `page.tsx` to async Server Component
2. Implement parallel data fetching with Promise.all()
3. Define prop interfaces for all child components

### Phase 3: Component Conversion - Simple (45 min)
Convert components with no interactivity:
1. Services.tsx
2. ClientLogos.tsx
3. Testimonials.tsx
4. Hero.tsx
5. AboutCTA.tsx
6. Footer.tsx

For each:
- Remove 'use client' directive
- Remove useState, useEffect, useContext
- Add props interface
- Accept data from parent
- Remove loading states (server-side doesn't need them)

### Phase 4: Component Conversion - Complex (45 min)
Split components with interactivity:

**Projects.tsx:**
```tsx
// projects/ProjectsSection.tsx (Server Component)
export default function ProjectsSection({ projects, sectionTitle }) {
  return (
    <section>
      <h2>{sectionTitle}</h2>
      <ProjectsClient projects={projects} />
    </section>
  )
}

// projects/ProjectsClient.tsx (Client Component)
'use client'
export default function ProjectsClient({ projects }) {
  const modal = useProjectModal()
  return (
    <>
      <ProjectsGrid projects={projects} onProjectClick={modal.openModal} />
      <ProjectModal {...modal} />
    </>
  )
}
```

**Header.tsx:**
```tsx
// Header.tsx (Server Component)
export default function Header({ settings }) {
  return <HeaderClient settings={settings} />
}

// HeaderClient.tsx (Client Component)
'use client'
export default function HeaderClient({ settings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // ... existing menu logic
}
```

### Phase 5: Context Cleanup (15 min)
1. Delete HomepageContext.tsx
2. Review SiteSettingsContext usage in other pages
3. Update imports across the codebase

### Phase 6: Testing (30 min)
1. Run build: `npm run build`
2. Visual regression testing on all pages
3. Test mobile menu interactions
4. Test project modal interactions
5. Verify data loads correctly
6. Check for hydration errors

### Phase 7: Performance Validation (15 min)
1. Deploy to preview environment
2. Run Lighthouse audit
3. Verify LCP improvement (target: <2,500ms)
4. Check for any layout shifts

## Risk Mitigation

### Potential Issues

1. **Hydration Mismatches**
   - Risk: Server HTML doesn't match client React
   - Prevention: Ensure no browser-only code in Server Components
   - Solution: Move to client components if needed

2. **Lost Interactivity**
   - Risk: Accidentally removing client-side features
   - Prevention: Careful analysis of all useState/onClick usage
   - Solution: Split into Server + Client components

3. **Context Dependencies**
   - Risk: Components in other pages still using removed contexts
   - Prevention: Search entire codebase for context usage
   - Solution: Update all references before deleting

4. **Type Safety**
   - Risk: Props interfaces not matching
   - Prevention: Define TypeScript interfaces first
   - Solution: Let TypeScript compiler catch mismatches

### Rollback Plan
If issues arise:
1. Revert to previous commit
2. Redeploy previous version
3. Analyze issues in local environment
4. Fix and retry

## Success Metrics

### Performance Targets
- ✅ LCP < 2,500ms (currently 4,970ms)
- ✅ Render delay < 500ms (currently 4,370ms)
- ✅ First Contentful Paint < 1,500ms
- ✅ Time to Interactive < 3,000ms

### Functional Requirements
- ✅ All interactive features work (modals, menus)
- ✅ All data displays correctly
- ✅ No hydration errors in console
- ✅ No layout shifts
- ✅ Mobile menu works
- ✅ Project modal works

### Code Quality
- ✅ Build completes without errors
- ✅ All tests pass
- ✅ No TypeScript errors
- ✅ No console errors/warnings

## Timeline Estimate

| Phase | Duration | Can Run in Parallel? |
|-------|----------|---------------------|
| Preparation | 30 min | No |
| Data Fetching Layer | 30 min | No |
| Simple Components | 45 min | After Phase 2 |
| Complex Components | 45 min | After Phase 2 |
| Context Cleanup | 15 min | After Phases 3 & 4 |
| Testing | 30 min | After Phase 5 |
| Performance Validation | 15 min | After Phase 6 |

**Total Sequential Time:** ~3 hours
**Optimistic Parallel Time:** ~2.5 hours

## Next Steps

1. Review this plan
2. Confirm approach
3. Create feature branch: `feature/server-components-migration`
4. Execute Phase 1 (Preparation)
5. Execute phases sequentially
6. Deploy to preview
7. Validate performance
8. Merge to main

## Notes

- This migration only affects the homepage initially
- Other pages (about, contact, etc.) can be migrated separately
- The lcp-optimization branch may have already done some of this work
- Consider reviewing that branch before starting fresh

## Questions to Answer Before Starting

1. Should we check the existing `lcp-optimization` branch first?
2. Do we want to migrate just homepage or all pages?
3. What's the deployment strategy (preview first, then production)?
4. Do we have rollback window requirements?
