# Image Cropping Implementation Checklist

Quick reference for tracking implementation progress.

## Phase 1: Schema Enhancement ⏱️ 4-6 hours

### Task 1.1: Create Custom Image Field Type
- [ ] Create `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/objects/responsiveImage.ts`
- [ ] Define responsiveImage type with hotspot enabled
- [ ] Add alt text field (required)
- [ ] Add caption field (optional)
- [ ] Configure preview

### Task 1.2: Create Aspect Ratio Preview Component
- [ ] Create `/Users/michaelevans/DOA/doa-website/sanity/components/AspectRatioPreview.tsx`
- [ ] Implement 16:9 preview
- [ ] Implement 4:5 preview
- [ ] Implement 1:1 preview
- [ ] Add TypeScript types

### Task 1.3: Update Project Schema
- [ ] Update `mainImage` field in `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/project.ts`
- [ ] Update `gallery` field in project.ts
- [ ] Test existing images still load

### Task 1.4: Update Team Member Schema
- [ ] Update `photo` field in `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/teamMember.ts`
- [ ] Add description for portrait usage

### Task 1.5: Update Other Schemas
- [ ] Update client.ts logo field
- [ ] Update aboutPage.ts image fields
- [ ] Update homepageSettings.ts image fields
- [ ] Update servicesPage.ts image fields (if applicable)

### Task 1.6: Register Schema Types
- [ ] Import responsiveImage in `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/index.ts`
- [ ] Add to schemaTypes array
- [ ] Restart Sanity Studio
- [ ] Verify no schema errors

---

## Phase 2: Helper Function Updates ⏱️ 2-3 hours

### Task 2.1: Enhance Image URL Builder
- [ ] Update `/Users/michaelevans/DOA/doa-website/sanity/lib/image.ts`
- [ ] Add AspectRatio type
- [ ] Create urlForWithOptions function
- [ ] Create landscapeImage function
- [ ] Create portraitImage function
- [ ] Create squareImage function
- [ ] Add JSDoc documentation

### Task 2.2: Create TypeScript Type Definitions
- [ ] Create/update `/Users/michaelevans/DOA/doa-website/src/types/sanity.ts`
- [ ] Define SanityImageHotspot interface
- [ ] Define SanityImageCrop interface
- [ ] Define SanityImageAsset interface
- [ ] Define SanityResponsiveImage interface
- [ ] Update Project and TeamMember types

---

## Phase 3: Component Integration ⏱️ 4-6 hours

### Task 3.1: Update Projects Component
- [ ] Modify `/Users/michaelevans/DOA/doa-website/src/components/Projects.tsx`
- [ ] Import landscapeImage
- [ ] Replace urlFor calls
- [ ] Update alt text handling
- [ ] Test visually

### Task 3.2: Update ProjectSlideshow Component
- [ ] Modify `/Users/michaelevans/DOA/doa-website/src/components/ProjectSlideshow.tsx`
- [ ] Handle mixed orientations
- [ ] Add orientation detection
- [ ] Test gallery display

### Task 3.3: Update Team Member Components
- [ ] Modify `/Users/michaelevans/DOA/doa-website/src/app/about/page.tsx`
- [ ] Import portraitImage
- [ ] Update team photo rendering
- [ ] Verify 4:5 aspect ratio

### Task 3.4: Update Client Logos Component
- [ ] Modify `/Users/michaelevans/DOA/doa-website/src/components/ClientLogos.tsx`
- [ ] Import squareImage
- [ ] Update logo rendering
- [ ] Verify 1:1 aspect ratio

### Task 3.5: Update Metadata Helper
- [ ] Modify `/Users/michaelevans/DOA/doa-website/src/lib/metadata.ts`
- [ ] Create getOgImageUrl function
- [ ] Use 1200x630 for OG images
- [ ] Test social sharing

### Task 3.6: Update Mock Image Helper
- [ ] Modify `/Users/michaelevans/DOA/doa-website/src/__mocks__/sanity/lib/image.ts`
- [ ] Mock urlForWithOptions
- [ ] Mock landscapeImage
- [ ] Mock portraitImage
- [ ] Mock squareImage

---

## Phase 4: Testing & Validation ⏱️ 3-4 hours

### Task 4.1: Unit Tests for Image Helpers
- [ ] Create `/Users/michaelevans/DOA/doa-website/src/sanity/lib/__tests__/image.test.ts`
- [ ] Test urlFor backward compatibility
- [ ] Test urlForWithOptions
- [ ] Test aspect ratio calculations
- [ ] Test convenience functions
- [ ] Achieve 100% coverage

### Task 4.2: Component Integration Tests
- [ ] Update `/Users/michaelevans/DOA/doa-website/src/components/__tests__/Projects.cms.test.tsx`
- [ ] Test landscape aspect ratio usage
- [ ] Test alt text handling
- [ ] Update other component tests
- [ ] Verify no test regressions

### Task 4.3: E2E Visual Tests
- [ ] Create `/Users/michaelevans/DOA/doa-website/tests/image-cropping.spec.ts`
- [ ] Test 16:9 project images
- [ ] Test 4:5 team photos
- [ ] Test 1:1 client logos
- [ ] Test image loading quality

### Task 4.4: Manual Testing
- [ ] Test Sanity Studio hotspot tool
- [ ] Test aspect ratio previews
- [ ] Test frontend rendering (all pages)
- [ ] Test mobile responsive
- [ ] Test tablet responsive
- [ ] Test desktop responsive
- [ ] Test Chrome, Firefox, Safari
- [ ] Test mobile browsers
- [ ] Check Lighthouse score
- [ ] Verify no layout shift

---

## Phase 5: Documentation & Migration ⏱️ 2-3 hours

### Task 5.1: Update Code Documentation
- [ ] Add JSDoc to all new functions
- [ ] Include usage examples
- [ ] Document parameters and returns

### Task 5.2: Create Editor Training Guide
- [ ] Create `/Users/michaelevans/DOA/doa-website/docs/IMAGE_EDITING_GUIDE.md`
- [ ] Write hotspot instructions
- [ ] Add best practices section
- [ ] Include troubleshooting
- [ ] Add screenshots (optional)

### Task 5.3: Migration Plan Documentation
- [ ] Create `/Users/michaelevans/DOA/memory-bank/IMAGE_MIGRATION_NOTES.md`
- [ ] Document backward compatibility
- [ ] Create GROQ queries for finding images
- [ ] Write content update workflow
- [ ] Estimate migration timeline

---

## Pre-Deployment Checklist

- [ ] All tests passing (`npm run test:all`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Lighthouse score maintained (90+)
- [ ] Visual review of all key pages
- [ ] Sanity Studio tested with real images
- [ ] Documentation complete
- [ ] Code review approved

---

## Post-Deployment Tasks

- [ ] Monitor Vercel Analytics (first 24 hours)
- [ ] Check Sanity Studio usage logs
- [ ] Collect editor feedback
- [ ] Review image CDN metrics
- [ ] Update Memory Bank with learnings
- [ ] Schedule editor training session
- [ ] Plan content migration priorities

---

## Quick Commands

```bash
# Development
cd /Users/michaelevans/DOA/doa-website
npm run dev

# Testing
npm test                    # Unit tests
npm run test:watch         # Watch mode
npm run test:e2e           # E2E tests
npm run test:all           # All tests

# Building
npm run build              # Production build
npm run lint               # Linting

# Memory System
npm run session:start      # Start session
npm run memory:note        # Add note
npm run session:end        # End session
```

---

**Progress Tracking**: Check off items as completed. Update this file in git for team visibility.

**Estimated Completion**: 2-3 days (15-22 hours)

**Last Updated**: 2025-10-02
