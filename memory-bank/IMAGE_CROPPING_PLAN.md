# Sanity Image Cropping Implementation Plan

**Status**: Ready for Implementation
**Created**: 2025-10-02
**Target Completion**: 2-3 days
**Priority**: Medium

---

## Executive Summary

### Overview
Implement landscape and portrait-aware image cropping for the DOA website using Sanity's built-in hotspot feature with custom aspect ratio previews. This will ensure images display optimally across different contexts (hero sections, gallery grids, team photos, project showcases) without manual post-processing.

### Why This Approach
After comprehensive research, we selected Sanity's native hotspot feature because:

1. **Zero Additional Dependencies**: Built into Sanity, no external plugins needed
2. **Editor-Friendly**: Visual interface for content editors, no technical knowledge required
3. **Production-Ready**: Battle-tested by thousands of Sanity projects
4. **Performant**: Leverages Sanity's CDN for optimized image delivery
5. **Future-Proof**: First-party support, guaranteed updates with Sanity releases

Alternative approaches (custom plugins, third-party solutions) were rejected due to maintenance overhead and complexity.

### Expected Outcomes
- Content editors can visually set image focal points in Sanity Studio
- Images automatically crop to predefined aspect ratios (16:9 landscape, 4:5 portrait, 1:1 square)
- Frontend components receive properly cropped images via URL parameters
- No breaking changes to existing images (graceful degradation)
- Improved visual consistency across the site

---

## Implementation Phases

### Phase 1: Schema Enhancement (4-6 hours)
Update all Sanity schemas with custom aspect ratio previews

### Phase 2: Helper Function Updates (2-3 hours)
Enhance image URL builder with aspect ratio support

### Phase 3: Component Integration (4-6 hours)
Update frontend components to use aspect ratio parameters

### Phase 4: Testing & Validation (3-4 hours)
Comprehensive testing across unit, integration, and E2E levels

### Phase 5: Documentation & Migration (2-3 hours)
Document usage and create editor training materials

**Total Estimated Time**: 15-22 hours (2-3 days)

---

## Detailed Task Breakdown

### PHASE 1: Schema Enhancement

#### Task 1.1: Create Custom Image Field Type
**File**: `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/objects/responsiveImage.ts` (new file)
**Time Estimate**: 1.5 hours

Create a reusable custom image field with aspect ratio previews:

```typescript
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'responsiveImage',
  title: 'Responsive Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      description: 'Important for SEO and accessibility',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional caption displayed below the image',
    }),
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'alt',
    },
    prepare({imageUrl, title}) {
      return {
        title: title || 'Untitled image',
        subtitle: 'Image',
        imageUrl,
      }
    },
  },
})
```

**Acceptance Criteria**:
- [ ] File created at correct path
- [ ] TypeScript types properly defined
- [ ] Hotspot enabled by default
- [ ] Alt text field required
- [ ] Preview displays correctly

#### Task 1.2: Create Aspect Ratio Preview Component
**File**: `/Users/michaelevans/DOA/doa-website/sanity/components/AspectRatioPreview.tsx` (new file)
**Time Estimate**: 2 hours

Build custom preview component showing multiple aspect ratios:

```typescript
import React from 'react'
import {ImagePreview} from 'sanity'

interface AspectRatioPreviewProps {
  value?: any
  aspectRatios?: {label: string; ratio: number}[]
}

export function AspectRatioPreview({
  value,
  aspectRatios = [
    {label: 'Landscape (16:9)', ratio: 16 / 9},
    {label: 'Portrait (4:5)', ratio: 4 / 5},
    {label: 'Square (1:1)', ratio: 1},
  ],
}: AspectRatioPreviewProps) {
  if (!value?.asset) {
    return <div>No image selected</div>
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      {aspectRatios.map(({label, ratio}) => (
        <div key={label}>
          <h4 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500}}>
            {label}
          </h4>
          <ImagePreview
            asset={value.asset}
            hotspot={value.hotspot}
            crop={value.crop}
            style={{
              aspectRatio: ratio.toString(),
              width: '100%',
              maxWidth: '400px',
              objectFit: 'cover',
            }}
          />
        </div>
      ))}
    </div>
  )
}
```

**Acceptance Criteria**:
- [ ] Component renders multiple aspect ratio previews
- [ ] Hotspot positioning visible in all previews
- [ ] Responsive design works in Sanity Studio
- [ ] TypeScript props properly typed

#### Task 1.3: Update Project Schema
**File**: `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/project.ts`
**Time Estimate**: 1 hour

Replace existing image fields with enhanced version:

```typescript
// BEFORE (lines 27-33):
defineField({
  name: 'mainImage',
  title: 'Main Image',
  type: 'image',
  options: {
    hotspot: true,
  },
}),

// AFTER:
defineField({
  name: 'mainImage',
  title: 'Main Image',
  type: 'responsiveImage',
  description: 'Will be displayed in landscape (16:9) on project pages',
}),

// BEFORE (lines 35-39):
defineField({
  name: 'gallery',
  title: 'Gallery Images',
  type: 'array',
  of: [{type: 'image', options: {hotspot: true}}],
}),

// AFTER:
defineField({
  name: 'gallery',
  title: 'Gallery Images',
  type: 'array',
  of: [{type: 'responsiveImage'}],
  description: 'Gallery images can be mixed landscape and portrait',
}),
```

**Acceptance Criteria**:
- [ ] mainImage uses responsiveImage type
- [ ] gallery uses responsiveImage type
- [ ] Existing images still load correctly
- [ ] Preview shows aspect ratio options

#### Task 1.4: Update Team Member Schema
**File**: `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/teamMember.ts`
**Time Estimate**: 30 minutes

Update photo field for portrait-optimized display:

```typescript
// BEFORE (lines 27-33):
defineField({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  options: {
    hotspot: true,
  },
}),

// AFTER:
defineField({
  name: 'photo',
  title: 'Photo',
  type: 'responsiveImage',
  description: 'Will be displayed in portrait (4:5) for team member cards',
}),
```

**Acceptance Criteria**:
- [ ] photo field uses responsiveImage
- [ ] Description clearly indicates portrait usage
- [ ] Existing team photos still display

#### Task 1.5: Update Other Schema Files
**Files**: All schema files with image fields
**Time Estimate**: 1 hour

Update remaining schemas:
- `client.ts` - logo images (square 1:1)
- `aboutPage.ts` - hero images (landscape 16:9)
- `homepageSettings.ts` - any hero/feature images

**Checklist**:
- [ ] client.ts logo updated
- [ ] aboutPage.ts images updated
- [ ] homepageSettings.ts images updated
- [ ] servicesPage.ts images updated (if applicable)
- [ ] All use responsiveImage type

#### Task 1.6: Register New Schema Types
**File**: `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/index.ts`
**Time Estimate**: 15 minutes

Import and register the new responsiveImage type:

```typescript
// Add to imports:
import responsiveImage from './objects/responsiveImage'

// Add to schemaTypes array:
export const schemaTypes = [
  // Objects first
  responsiveImage,

  // Then documents
  project,
  client,
  testimonial,
  service,
  teamMember,
  siteSettings,
  homepageSettings,
  aboutPage,
  emailSettings,
  contactPage,
  servicesPage,
  projectsPage,
]
```

**Acceptance Criteria**:
- [ ] responsiveImage imported
- [ ] Added to schemaTypes array
- [ ] Schema validates without errors
- [ ] Sanity Studio restarts successfully

---

### PHASE 2: Helper Function Updates

#### Task 2.1: Enhance Image URL Builder
**File**: `/Users/michaelevans/DOA/doa-website/sanity/lib/image.ts`
**Time Estimate**: 2 hours

Add aspect ratio support to urlFor helper:

```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

export type AspectRatio = '16:9' | '4:5' | '1:1' | 'original'

interface ImageUrlOptions {
  width?: number
  height?: number
  aspectRatio?: AspectRatio
  quality?: number
  auto?: 'format'
}

const ASPECT_RATIOS: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '4:5': 4 / 5,
  '1:1': 1,
  'original': 0, // No cropping
}

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function urlForWithOptions(
  source: SanityImageSource,
  options: ImageUrlOptions = {}
) {
  let imageBuilder = builder.image(source)

  // Apply width
  if (options.width) {
    imageBuilder = imageBuilder.width(options.width)
  }

  // Apply height
  if (options.height) {
    imageBuilder = imageBuilder.height(options.height)
  }

  // Apply aspect ratio cropping
  if (options.aspectRatio && options.aspectRatio !== 'original') {
    const ratio = ASPECT_RATIOS[options.aspectRatio]
    if (options.width) {
      const height = Math.round(options.width / ratio)
      imageBuilder = imageBuilder.height(height)
    } else if (options.height) {
      const width = Math.round(options.height * ratio)
      imageBuilder = imageBuilder.width(width)
    }
    // Use focal point from hotspot
    imageBuilder = imageBuilder.fit('crop').crop('focalpoint')
  }

  // Apply quality
  if (options.quality) {
    imageBuilder = imageBuilder.quality(options.quality)
  }

  // Auto format
  if (options.auto === 'format') {
    imageBuilder = imageBuilder.auto('format')
  }

  return imageBuilder
}

// Convenience functions for common use cases
export function landscapeImage(source: SanityImageSource, width = 1200) {
  return urlForWithOptions(source, {
    width,
    aspectRatio: '16:9',
    quality: 85,
    auto: 'format',
  })
}

export function portraitImage(source: SanityImageSource, width = 600) {
  return urlForWithOptions(source, {
    width,
    aspectRatio: '4:5',
    quality: 85,
    auto: 'format',
  })
}

export function squareImage(source: SanityImageSource, width = 400) {
  return urlForWithOptions(source, {
    width,
    aspectRatio: '1:1',
    quality: 85,
    auto: 'format',
  })
}
```

**Acceptance Criteria**:
- [ ] TypeScript types exported
- [ ] Backward compatible (urlFor unchanged)
- [ ] New functions properly handle hotspot
- [ ] Quality and format optimization included
- [ ] JSDoc comments added

#### Task 2.2: Create TypeScript Type Definitions
**File**: `/Users/michaelevans/DOA/doa-website/src/types/sanity.ts` (new or update existing)
**Time Estimate**: 1 hour

Define types for image objects with hotspot data:

```typescript
export interface SanityImageHotspot {
  x: number
  y: number
  height: number
  width: number
}

export interface SanityImageCrop {
  top: number
  bottom: number
  left: number
  right: number
}

export interface SanityImageAsset {
  _id: string
  _type: 'sanity.imageAsset'
  url: string
  metadata?: {
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
  }
}

export interface SanityResponsiveImage {
  _type: 'responsiveImage'
  asset: SanityImageAsset
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
  alt: string
  caption?: string
}

// Extend existing types
export interface Project {
  _id: string
  _type: 'project'
  title: string
  client?: string
  mainImage?: SanityResponsiveImage
  gallery?: SanityResponsiveImage[]
  description?: string
  year?: number
  order?: number
  featured?: boolean
}

export interface TeamMember {
  _id: string
  _type: 'teamMember'
  name: string
  role?: string
  bio?: string
  photo?: SanityResponsiveImage
  imdbUrl?: string
  order?: number
}
```

**Acceptance Criteria**:
- [ ] All image-related types defined
- [ ] Matches Sanity schema structure
- [ ] Exported for use in components
- [ ] Hotspot and crop types included

---

### PHASE 3: Component Integration

#### Task 3.1: Update Projects Component
**File**: `/Users/michaelevans/DOA/doa-website/src/components/Projects.tsx`
**Time Estimate**: 1.5 hours

Replace urlFor calls with landscape-optimized versions:

```typescript
// BEFORE:
import { urlFor } from '@/sanity/lib/image'

// In render:
<img
  src={urlFor(project.mainImage).width(600).url()}
  alt={project.title}
/>

// AFTER:
import { landscapeImage } from '@/sanity/lib/image'
import type { SanityResponsiveImage } from '@/types/sanity'

// In render:
<img
  src={landscapeImage(project.mainImage, 600).url()}
  alt={project.mainImage?.alt || project.title}
/>
```

**Acceptance Criteria**:
- [ ] All project images use landscapeImage
- [ ] Alt text from image or fallback
- [ ] Multiple sizes for responsive images
- [ ] TypeScript types correct

#### Task 3.2: Update ProjectSlideshow Component
**File**: `/Users/michaelevans/DOA/doa-website/src/components/ProjectSlideshow.tsx`
**Time Estimate**: 1 hour

Handle mixed landscape/portrait gallery images:

```typescript
import { urlForWithOptions } from '@/sanity/lib/image'

// Detect orientation from metadata or use default
const getImageUrl = (image: SanityResponsiveImage, width = 1200) => {
  // Check if image has portrait orientation
  const isPortrait = image.asset?.metadata?.dimensions?.aspectRatio < 1

  return urlForWithOptions(image, {
    width,
    aspectRatio: isPortrait ? '4:5' : '16:9',
    quality: 85,
    auto: 'format',
  }).url()
}
```

**Acceptance Criteria**:
- [ ] Gallery supports mixed orientations
- [ ] Portrait detection works correctly
- [ ] Slideshow maintains aspect ratios
- [ ] Performance remains optimal

#### Task 3.3: Update Team Member Components
**File**: `/Users/michaelevans/DOA/doa-website/src/app/about/page.tsx` (or team member card component)
**Time Estimate**: 1 hour

Use portrait-optimized images for team photos:

```typescript
import { portraitImage } from '@/sanity/lib/image'

// In render:
<img
  src={portraitImage(member.photo, 400).url()}
  alt={member.photo?.alt || member.name}
  className="team-member-photo"
/>
```

**Acceptance Criteria**:
- [ ] Team photos use portraitImage
- [ ] Consistent 4:5 aspect ratio
- [ ] Alt text properly handled
- [ ] Responsive sizing

#### Task 3.4: Update Client Logos Component
**File**: `/Users/michaelevans/DOA/doa-website/src/components/ClientLogos.tsx`
**Time Estimate**: 45 minutes

Use square aspect ratio for logos:

```typescript
import { squareImage } from '@/sanity/lib/image'

// In render:
<img
  src={squareImage(client.logo, 200).url()}
  alt={client.logo?.alt || client.name}
/>
```

**Acceptance Criteria**:
- [ ] Logos use squareImage
- [ ] Consistent sizing across logos
- [ ] High quality maintained

#### Task 3.5: Update Metadata Helper
**File**: `/Users/michaelevans/DOA/doa-website/src/lib/metadata.ts`
**Time Estimate**: 30 minutes

Ensure Open Graph images use appropriate aspect ratios:

```typescript
import { urlForWithOptions } from '@/sanity/lib/image'

// OG images should be 1200x630 (1.91:1)
export function getOgImageUrl(image: SanityResponsiveImage) {
  return urlForWithOptions(image, {
    width: 1200,
    height: 630,
    quality: 90,
    auto: 'format',
  }).url()
}
```

**Acceptance Criteria**:
- [ ] OG images meet social platform requirements
- [ ] Quality optimized for sharing
- [ ] Hotspot respected in crops

#### Task 3.6: Update Mock Image Helper
**File**: `/Users/michaelevans/DOA/doa-website/src/__mocks__/sanity/lib/image.ts`
**Time Estimate**: 30 minutes

Mirror new functions in test mocks:

```typescript
export function urlForWithOptions(source: any, options: any) {
  return {
    url: () => 'https://example.com/mocked-image.jpg',
  }
}

export function landscapeImage(source: any, width?: number) {
  return urlForWithOptions(source, {width, aspectRatio: '16:9'})
}

export function portraitImage(source: any, width?: number) {
  return urlForWithOptions(source, {width, aspectRatio: '4:5'})
}

export function squareImage(source: any, width?: number) {
  return urlForWithOptions(source, {width, aspectRatio: '1:1'})
}
```

**Acceptance Criteria**:
- [ ] All new functions mocked
- [ ] Tests continue to pass
- [ ] Mock API matches real implementation

---

### PHASE 4: Testing & Validation

#### Task 4.1: Unit Tests for Image Helpers
**File**: `/Users/michaelevans/DOA/doa-website/src/sanity/lib/__tests__/image.test.ts` (new file)
**Time Estimate**: 1.5 hours

Test aspect ratio calculations and URL generation:

```typescript
import {
  urlFor,
  urlForWithOptions,
  landscapeImage,
  portraitImage,
  squareImage,
} from '../image'

describe('Image URL Helpers', () => {
  const mockImage = {
    _type: 'responsiveImage',
    asset: {
      _id: 'image-123',
      _type: 'sanity.imageAsset',
      url: 'https://cdn.sanity.io/images/test.jpg',
    },
  }

  describe('urlFor (backward compatibility)', () => {
    it('returns image builder', () => {
      const builder = urlFor(mockImage)
      expect(builder).toBeDefined()
      expect(builder.url).toBeDefined()
    })
  })

  describe('urlForWithOptions', () => {
    it('applies width parameter', () => {
      const url = urlForWithOptions(mockImage, {width: 800}).url()
      expect(url).toContain('w=800')
    })

    it('applies aspect ratio for landscape', () => {
      const url = urlForWithOptions(mockImage, {
        width: 1600,
        aspectRatio: '16:9',
      }).url()
      expect(url).toContain('w=1600')
      expect(url).toContain('h=900')
    })

    it('uses focalpoint crop when aspect ratio specified', () => {
      const url = urlForWithOptions(mockImage, {
        width: 800,
        aspectRatio: '4:5',
      }).url()
      expect(url).toContain('fit=crop')
      expect(url).toContain('crop=focalpoint')
    })
  })

  describe('convenience functions', () => {
    it('landscapeImage creates 16:9 images', () => {
      const url = landscapeImage(mockImage, 1200).url()
      expect(url).toContain('w=1200')
      expect(url).toContain('h=675')
    })

    it('portraitImage creates 4:5 images', () => {
      const url = portraitImage(mockImage, 600).url()
      expect(url).toContain('w=600')
      expect(url).toContain('h=750')
    })

    it('squareImage creates 1:1 images', () => {
      const url = squareImage(mockImage, 400).url()
      expect(url).toContain('w=400')
      expect(url).toContain('h=400')
    })
  })
})
```

**Acceptance Criteria**:
- [ ] All helper functions tested
- [ ] URL parameters verified
- [ ] Edge cases covered
- [ ] 100% code coverage for helpers

#### Task 4.2: Component Integration Tests
**File**: `/Users/michaelevans/DOA/doa-website/src/components/__tests__/Projects.cms.test.tsx`
**Time Estimate**: 1 hour

Update existing tests for new image handling:

```typescript
import { render, screen } from '@testing-library/react'
import Projects from '../Projects'
import { landscapeImage } from '@/sanity/lib/image'

jest.mock('@/sanity/lib/image')

describe('Projects Component', () => {
  it('uses landscape aspect ratio for project images', () => {
    const mockProjects = [
      {
        _id: '1',
        title: 'Test Project',
        mainImage: {
          _type: 'responsiveImage',
          asset: {_id: 'img-1', url: 'test.jpg'},
          alt: 'Test image',
        },
      },
    ]

    render(<Projects projects={mockProjects} />)

    expect(landscapeImage).toHaveBeenCalledWith(
      mockProjects[0].mainImage,
      expect.any(Number)
    )
  })

  it('uses alt text from image object', () => {
    const mockProjects = [
      {
        _id: '1',
        title: 'Test Project',
        mainImage: {
          _type: 'responsiveImage',
          asset: {_id: 'img-1', url: 'test.jpg'},
          alt: 'Custom alt text',
        },
      },
    ]

    render(<Projects projects={mockProjects} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Custom alt text')
  })
})
```

**Acceptance Criteria**:
- [ ] All component tests updated
- [ ] New image helpers mocked correctly
- [ ] Alt text handling tested
- [ ] No test regressions

#### Task 4.3: E2E Visual Tests
**File**: `/Users/michaelevans/DOA/doa-website/tests/image-cropping.spec.ts` (new file)
**Time Estimate**: 1.5 hours

Test image display in browser:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Image Cropping', () => {
  test('project images maintain 16:9 aspect ratio', async ({ page }) => {
    await page.goto('/projects')

    const projectImage = page.locator('.project-card img').first()
    await expect(projectImage).toBeVisible()

    const box = await projectImage.boundingBox()
    if (box) {
      const aspectRatio = box.width / box.height
      expect(aspectRatio).toBeCloseTo(16 / 9, 1)
    }
  })

  test('team photos maintain 4:5 aspect ratio', async ({ page }) => {
    await page.goto('/about')

    const teamPhoto = page.locator('.team-member-photo').first()
    await expect(teamPhoto).toBeVisible()

    const box = await teamPhoto.boundingBox()
    if (box) {
      const aspectRatio = box.width / box.height
      expect(aspectRatio).toBeCloseTo(4 / 5, 1)
    }
  })

  test('client logos are square', async ({ page }) => {
    await page.goto('/clients')

    const logo = page.locator('.client-logo img').first()
    await expect(logo).toBeVisible()

    const box = await logo.boundingBox()
    if (box) {
      const aspectRatio = box.width / box.height
      expect(aspectRatio).toBeCloseTo(1, 1)
    }
  })

  test('images load with proper quality', async ({ page }) => {
    await page.goto('/')

    const responses = []
    page.on('response', response => {
      if (response.url().includes('cdn.sanity.io')) {
        responses.push(response)
      }
    })

    await page.waitForLoadState('networkidle')

    expect(responses.length).toBeGreaterThan(0)
    responses.forEach(response => {
      expect(response.status()).toBe(200)
      expect(response.url()).toContain('auto=format')
    })
  })
})
```

**Acceptance Criteria**:
- [ ] All aspect ratios verified visually
- [ ] Images load successfully
- [ ] No layout shift issues
- [ ] Performance acceptable

#### Task 4.4: Manual Testing Checklist
**Time Estimate**: 1 hour

Create and execute manual test plan:

**Sanity Studio Testing**:
- [ ] Upload new image to project
- [ ] Set hotspot on image
- [ ] View aspect ratio previews (16:9, 4:5, 1:1)
- [ ] Verify hotspot stays in frame for all ratios
- [ ] Publish and verify on frontend

**Frontend Testing**:
- [ ] Homepage featured projects (landscape)
- [ ] Projects page grid (landscape)
- [ ] Project gallery (mixed orientations)
- [ ] About page team photos (portrait)
- [ ] Clients page logos (square)
- [ ] Mobile responsive behavior
- [ ] Tablet responsive behavior
- [ ] Desktop responsive behavior

**Browser Testing**:
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Performance Testing**:
- [ ] Lighthouse score maintained
- [ ] Image loading times acceptable
- [ ] CDN cache hit rate high
- [ ] No CLS (Cumulative Layout Shift)

---

### PHASE 5: Documentation & Migration

#### Task 5.1: Update Code Documentation
**Files**: Add JSDoc comments to all new functions
**Time Estimate**: 30 minutes

Document usage patterns:

```typescript
/**
 * Creates a landscape-oriented image URL (16:9 aspect ratio)
 * Uses the image's hotspot to determine focal point for cropping
 *
 * @param source - Sanity image object with hotspot data
 * @param width - Target width in pixels (default: 1200)
 * @returns Image URL builder instance
 *
 * @example
 * ```tsx
 * <img
 *   src={landscapeImage(project.mainImage, 800).url()}
 *   alt={project.mainImage.alt}
 * />
 * ```
 */
export function landscapeImage(source: SanityImageSource, width = 1200) {
  // implementation
}
```

**Acceptance Criteria**:
- [ ] All public functions documented
- [ ] Examples provided
- [ ] Parameters explained
- [ ] Return types documented

#### Task 5.2: Create Editor Training Guide
**File**: `/Users/michaelevans/DOA/doa-website/docs/IMAGE_EDITING_GUIDE.md` (new file)
**Time Estimate**: 1 hour

Write guide for content editors:

```markdown
# Image Editing Guide for Sanity Studio

## Overview
DOA website uses smart image cropping to ensure images look great on all devices.
Each image you upload can be cropped to different aspect ratios automatically.

## Setting the Focal Point (Hotspot)

1. Upload your image in Sanity Studio
2. Click the "Edit" button on the image
3. Click "Hotspot" in the toolbar
4. Drag the circle to the most important part of your image
5. This ensures that part stays visible in all crops

## Aspect Ratio Previews

After setting the hotspot, you'll see three previews:

- **Landscape (16:9)**: Used for project pages and hero sections
- **Portrait (4:5)**: Used for team member photos
- **Square (1:1)**: Used for client logos

Make sure the important content is visible in all three previews.

## Best Practices

- Always set a hotspot on images with people or key subjects
- Write descriptive alt text (required for accessibility)
- Use high-resolution images (min 1200px wide for landscape)
- Avoid text in images (it may get cropped)

## Image Types by Section

| Section | Recommended Orientation | Minimum Size |
|---------|------------------------|--------------|
| Project Main Image | Landscape | 1600x900px |
| Project Gallery | Mixed | 1200px wide |
| Team Photos | Portrait | 800x1000px |
| Client Logos | Square | 400x400px |
```

**Acceptance Criteria**:
- [ ] Clear step-by-step instructions
- [ ] Screenshots included
- [ ] Best practices documented
- [ ] Troubleshooting section

#### Task 5.3: Migration Plan Documentation
**File**: `/Users/michaelevans/DOA/memory-bank/IMAGE_MIGRATION_NOTES.md` (new file)
**Time Estimate**: 30 minutes

Document migration approach:

```markdown
# Image Migration Notes

## Backward Compatibility

The new image system is fully backward compatible:

- Existing images without hotspots will use default center cropping
- Old `urlFor()` function still works (unchanged)
- No data migration required

## Recommended Migration Steps

1. **Phase 1**: Upload new images with hotspots (ongoing)
2. **Phase 2**: Update high-priority existing images:
   - Featured projects (most visible)
   - Team member photos
   - Client logos
3. **Phase 3**: Update remaining images (as time permits)

## Identifying Images to Update

Run this GROQ query in Sanity Vision to find images without hotspots:

```groq
*[_type == "project" && defined(mainImage) && !defined(mainImage.hotspot)] {
  _id,
  title,
  "hasHotspot": defined(mainImage.hotspot)
}
```

## Content Editor Workflow

1. Open document in Sanity Studio
2. Click image field
3. Click "Edit hotspot"
4. Position focal point
5. Save and publish
```

**Acceptance Criteria**:
- [ ] Migration strategy documented
- [ ] GROQ queries provided
- [ ] Timeline estimated
- [ ] Rollback plan included

---

## Testing Strategy

### Test Levels

1. **Unit Tests** (Jest)
   - Image helper functions
   - Aspect ratio calculations
   - URL parameter generation

2. **Integration Tests** (Jest + Testing Library)
   - Component image rendering
   - Alt text handling
   - Mock data compatibility

3. **CMS Integration Tests**
   - Schema validation
   - Sanity Studio preview rendering
   - Content fetching with new fields

4. **E2E Tests** (Playwright)
   - Visual aspect ratio verification
   - Image loading performance
   - Responsive behavior
   - Cross-browser compatibility

5. **Manual Tests**
   - Sanity Studio usability
   - Editor workflow
   - Multi-device testing

### Test Coverage Goals

- Unit tests: 100% for helper functions
- Integration tests: 90% for image-rendering components
- E2E tests: Critical user paths covered
- Manual tests: All major browsers/devices

### Regression Prevention

- [ ] Add visual regression tests (consider Playwright screenshots)
- [ ] Monitor Lighthouse scores before/after
- [ ] Test with real Sanity data, not just mocks
- [ ] Verify existing images still render

---

## Migration Strategy

### Handling Existing Images

**No Breaking Changes**:
- Images without hotspots use default center crop
- `urlFor()` function remains unchanged
- Existing components continue working

**Gradual Enhancement**:
1. New images automatically get hotspot capability
2. Update high-visibility images first (featured projects, team photos)
3. Low-priority images can be updated over time
4. No forced migration required

### Content Editor Training

**Training Sessions**:
- [ ] Schedule 30-minute walkthrough for editors
- [ ] Record video tutorial for async reference
- [ ] Provide written quick-reference guide
- [ ] Set up practice environment in Sanity

**Key Concepts to Cover**:
- What is a hotspot and why it matters
- How to set focal points effectively
- Understanding aspect ratio previews
- Writing good alt text
- When to re-crop existing images

### Content Update Workflow

**Priority Order**:
1. Featured projects (homepage visibility)
2. Team member photos (brand consistency)
3. Client logos (professional appearance)
4. Project galleries (user experience)
5. Other images (as needed)

**Checklist per Image**:
- [ ] Open in Sanity Studio
- [ ] Click "Edit hotspot"
- [ ] Position focal point on key subject
- [ ] Preview all aspect ratios
- [ ] Add/update alt text
- [ ] Add optional caption
- [ ] Save and publish

---

## Success Criteria

### Technical Success

- [ ] All aspect ratio functions working correctly
- [ ] Hotspot data properly saved and retrieved
- [ ] Image URLs contain correct crop parameters
- [ ] Sanity Studio previews display accurately
- [ ] No performance degradation
- [ ] All tests passing (unit, integration, E2E)
- [ ] TypeScript types properly enforced
- [ ] Backward compatibility maintained

### User Experience Success

- [ ] Images display with consistent aspect ratios
- [ ] Important subjects stay in frame across devices
- [ ] No visible cropping artifacts
- [ ] Fast image loading times
- [ ] Responsive behavior smooth
- [ ] Alt text improves accessibility scores

### Content Editor Success

- [ ] Editors can use hotspot tool without training
- [ ] Aspect ratio previews help decision-making
- [ ] Workflow feels intuitive
- [ ] Documentation is clear and helpful
- [ ] No increase in content publishing time

### Business Success

- [ ] Visual consistency across website improved
- [ ] Professional appearance on all devices
- [ ] Accessibility compliance maintained
- [ ] Page load performance maintained or improved
- [ ] Content team satisfied with tool

### Measurable Metrics

**Performance**:
- Lighthouse score: No decrease (target: 90+)
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- Image CDN cache hit rate: > 95%

**Quality**:
- Test coverage: > 90%
- TypeScript strict mode: No errors
- Accessibility score: No decrease (target: 100)
- Zero console errors on production

**Adoption**:
- 100% of new images use hotspot
- 80% of featured content updated within 2 weeks
- Zero support tickets from editors
- Positive feedback from content team

---

## Risk Assessment

### Potential Issues & Mitigation

#### Risk 1: Performance Impact
**Description**: Additional URL parameters might slow image loading
**Likelihood**: Low
**Impact**: Medium
**Mitigation**:
- Sanity CDN caches all variations
- Pre-generate common sizes
- Monitor performance metrics
- Use WebP/AVIF via auto=format

**Rollback Plan**:
- Remove aspect ratio parameters
- Revert to simple `urlFor()` calls
- No data loss (hotspot data preserved)

#### Risk 2: Editor Confusion
**Description**: Hotspot tool might confuse non-technical editors
**Likelihood**: Medium
**Impact**: Low
**Mitigation**:
- Comprehensive training documentation
- Video tutorials
- Practice environment
- Clear in-Studio help text

**Rollback Plan**:
- Hotspot is optional
- Images work without hotspot
- Can ignore new features

#### Risk 3: Existing Images Look Wrong
**Description**: Center-crop default might crop important content
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Test with production image data
- Visual review of key pages
- Prioritize high-visibility images
- Gradual rollout

**Rollback Plan**:
- Revert specific components
- Add manual crop overrides
- Update hotspots retroactively

#### Risk 4: Schema Migration Issues
**Description**: Schema changes might break existing content
**Likelihood**: Low
**Impact**: High
**Mitigation**:
- Test in development Sanity project first
- Backup production dataset
- Gradual schema deployment
- Monitor Sanity Studio logs

**Rollback Plan**:
- Revert schema changes via Sanity CLI
- Restore from backup if needed
- Keep old image type available

#### Risk 5: TypeScript Type Mismatches
**Description**: Updated types might break existing components
**Likelihood**: Medium
**Impact**: Low
**Mitigation**:
- Strict TypeScript checking
- Update all import statements
- Comprehensive type tests
- Gradual component updates

**Rollback Plan**:
- Revert type definitions
- Use `any` temporarily (not ideal)
- Fix type issues incrementally

### Monitoring Plan

**During Implementation**:
- Run tests after each task
- Check Sanity Studio after schema changes
- Review TypeScript errors continuously
- Test in local environment frequently

**Post-Deployment**:
- Monitor Vercel Analytics for performance
- Check Sanity Studio usage logs
- Review user feedback from editors
- Track image CDN metrics

**Alert Triggers**:
- Lighthouse score drops > 5 points
- Error rate increases > 1%
- Image loading time > 3s
- Editor support requests spike

---

## Timeline & Estimates

### Phase Breakdown

| Phase | Tasks | Time Estimate | Dependencies |
|-------|-------|---------------|--------------|
| 1: Schema Enhancement | 6 tasks | 4-6 hours | None |
| 2: Helper Functions | 2 tasks | 2-3 hours | Phase 1 complete |
| 3: Component Integration | 6 tasks | 4-6 hours | Phase 2 complete |
| 4: Testing & Validation | 4 tasks | 3-4 hours | Phase 3 complete |
| 5: Documentation | 3 tasks | 2-3 hours | Phase 4 complete |

**Total Time**: 15-22 hours (2-3 days)

### Daily Schedule (Recommended)

**Day 1** (6-8 hours):
- Morning: Phase 1 - Schema Enhancement (tasks 1.1-1.4)
- Afternoon: Phase 1 - Schema Enhancement (tasks 1.5-1.6)
- End of day: Test Sanity Studio, verify schemas load

**Day 2** (5-7 hours):
- Morning: Phase 2 - Helper Functions (tasks 2.1-2.2)
- Afternoon: Phase 3 - Component Integration (tasks 3.1-3.4)
- End of day: Manual smoke test of frontend

**Day 3** (4-7 hours):
- Morning: Phase 3 - Component Integration (tasks 3.5-3.6)
- Midday: Phase 4 - Testing & Validation (tasks 4.1-4.3)
- Afternoon: Phase 4 - Manual testing (task 4.4)
- End of day: Phase 5 - Documentation (tasks 5.1-5.3)

### Buffer Time

- Add 20% buffer for unexpected issues (3-4 hours)
- Allow time for code review (1-2 hours)
- Plan for testing iterations (1-2 hours)

**Total with Buffer**: 20-30 hours (2.5-4 days)

### Resource Requirements

**Developer Time**:
- 1 full-stack developer (primary)
- Code reviewer availability (1-2 hours)

**Tools & Access**:
- Sanity Studio access (development dataset)
- Vercel preview deployments
- Local development environment
- Browser testing tools

**External Dependencies**:
- None (all built-in Sanity features)

---

## Post-Implementation

### Monitoring (First 2 Weeks)

- [ ] Daily: Check Vercel Analytics for errors
- [ ] Daily: Review Sanity Studio usage
- [ ] Weekly: Collect editor feedback
- [ ] Weekly: Review image CDN metrics

### Optimization Opportunities

- Add responsive image srcset attributes
- Implement lazy loading with blur placeholders
- Create image size presets for common uses
- Add WebP/AVIF format detection
- Optimize aspect ratio detection algorithm

### Future Enhancements

- Custom aspect ratios per content type
- Multiple hotspots for art direction
- Automatic subject detection via AI
- Image optimization recommendations
- Batch hotspot editing tool

### Maintenance

- Quarterly review of image loading performance
- Annual review of aspect ratio standards
- Update documentation as Sanity evolves
- Monitor for new Sanity image features

---

## Appendix

### File Reference

**New Files to Create**:
```
/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/objects/responsiveImage.ts
/Users/michaelevans/DOA/doa-website/sanity/components/AspectRatioPreview.tsx
/Users/michaelevans/DOA/doa-website/src/sanity/lib/__tests__/image.test.ts
/Users/michaelevans/DOA/doa-website/tests/image-cropping.spec.ts
/Users/michaelevans/DOA/doa-website/docs/IMAGE_EDITING_GUIDE.md
/Users/michaelevans/DOA/memory-bank/IMAGE_MIGRATION_NOTES.md
```

**Files to Modify**:
```
/Users/michaelevans/DOA/doa-website/sanity/lib/image.ts
/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/index.ts
/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/project.ts
/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/teamMember.ts
/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/client.ts
/Users/michaelevans/DOA/doa-website/src/components/Projects.tsx
/Users/michaelevans/DOA/doa-website/src/components/ProjectSlideshow.tsx
/Users/michaelevans/DOA/doa-website/src/components/ClientLogos.tsx
/Users/michaelevans/DOA/doa-website/src/app/about/page.tsx
/Users/michaelevans/DOA/doa-website/src/lib/metadata.ts
/Users/michaelevans/DOA/doa-website/src/__mocks__/sanity/lib/image.ts
/Users/michaelevans/DOA/doa-website/src/types/sanity.ts
/Users/michaelevans/DOA/doa-website/src/components/__tests__/Projects.cms.test.tsx
```

### Useful GROQ Queries

**Find images without hotspots**:
```groq
*[_type == "project" && defined(mainImage) && !defined(mainImage.hotspot)] {
  _id,
  title,
  "imageUrl": mainImage.asset->url
}
```

**Find images with hotspots**:
```groq
*[_type == "project" && defined(mainImage.hotspot)] {
  _id,
  title,
  "hotspot": mainImage.hotspot
}
```

**Count images by type**:
```groq
{
  "projectImages": count(*[_type == "project" && defined(mainImage)]),
  "teamPhotos": count(*[_type == "teamMember" && defined(photo)]),
  "clientLogos": count(*[_type == "client" && defined(logo)])
}
```

### Common Aspect Ratios Reference

| Name | Ratio | Decimal | Use Case |
|------|-------|---------|----------|
| Landscape | 16:9 | 1.778 | Projects, hero images |
| Portrait | 4:5 | 0.8 | Team photos, portraits |
| Square | 1:1 | 1.0 | Logos, avatars |
| Widescreen | 21:9 | 2.333 | Cinematic (future) |
| Classic | 4:3 | 1.333 | Legacy (if needed) |
| OG Image | 1.91:1 | 1.91 | Social media |

### Sanity Image URL Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `w` | number | Width in pixels |
| `h` | number | Height in pixels |
| `fit` | crop, max, min | Fit mode |
| `crop` | focalpoint, center, top | Crop anchor |
| `q` | 0-100 | Quality percentage |
| `auto` | format | Auto-optimize format |
| `dpr` | 1, 2, 3 | Device pixel ratio |

### Contact & Support

**Questions During Implementation**:
- Check Sanity documentation: https://www.sanity.io/docs/image-url
- Review @sanity/image-url API: https://github.com/sanity-io/image-url

**Issues & Bugs**:
- Document in project issue tracker
- Include screenshots from Sanity Studio
- Provide example image URLs

---

**Document Version**: 1.0
**Last Updated**: 2025-10-02
**Next Review**: After Phase 4 completion
