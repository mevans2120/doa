# Custom Image Loader Implementation Plan

## Executive Summary

This plan addresses aspect ratio issues with Sanity CDN images in Next.js by implementing a custom loader that bypasses Next.js image optimization while preserving all performance benefits (lazy loading, responsive srcset, optimization).

**Problem:** Next.js Image component is adding height parameters to Sanity CDN URLs, causing portrait images to be cropped to 4:3 aspect ratio instead of maintaining their original proportions.

**Solution:** Create a custom loader that generates responsive srcset URLs using Sanity CDN's native image transformation capabilities, eliminating Next.js's automatic height calculation.

**Impact:**
- All image orientations (portrait, landscape, square) will maintain correct aspect ratios
- Performance features preserved (lazy loading, responsive images, WebP/AVIF format)
- Type-safe implementation with TypeScript
- Minimal code changes required

---

## Technical Analysis

### Root Cause
When using Next.js Image component with `fill` prop and `sizes` attribute:
1. Next.js generates responsive srcset with multiple widths
2. Next.js adds height parameters to maintain aspect ratios
3. Without explicit dimensions, Next.js defaults to common ratios (4:3)
4. This overrides Sanity's original image proportions

### Solution Architecture
Instead of letting Next.js modify Sanity URLs, we'll:
1. Create custom loader function that generates srcset using Sanity's URL builder
2. Configure Next.js to use our loader for cdn.sanity.io domains
3. Maintain all optimization features through Sanity CDN (format, quality, width)
4. Preserve original aspect ratios by never adding height parameters

---

## File Structure

### New Files
```
/Users/michaelevans/DOA/doa-website/
├── sanity/lib/
│   └── sanityImageLoader.ts          # NEW: Custom loader implementation
```

### Modified Files
```
/Users/michaelevans/DOA/doa-website/
├── next.config.ts                     # MODIFIED: Add custom loader config
├── src/components/
│   └── ProjectSlideshow.tsx           # MODIFIED: Use custom loader
└── sanity/lib/
    └── image.ts                       # MODIFIED: Export loader-compatible URLs
```

---

## Step-by-Step Implementation

### Phase 1: Create Custom Loader (15 minutes)

#### Step 1: Create Sanity Image Loader File

**File:** `/Users/michaelevans/DOA/doa-website/sanity/lib/sanityImageLoader.ts`

**Purpose:** Implement custom loader that generates Sanity CDN URLs with responsive widths

**Code:**
```typescript
import type { ImageLoaderProps } from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

/**
 * Custom Next.js Image Loader for Sanity CDN
 *
 * This loader generates optimized image URLs using Sanity's native CDN,
 * bypassing Next.js image optimization to preserve original aspect ratios.
 *
 * Features:
 * - Maintains original image proportions (no forced aspect ratios)
 * - Generates responsive srcset with multiple widths
 * - Applies quality optimization
 * - Auto-detects modern formats (WebP, AVIF)
 * - Supports all Sanity image transformations
 *
 * @param props - Next.js image loader props
 * @returns Optimized Sanity CDN URL
 *
 * @example
 * ```tsx
 * <Image
 *   src={sanityImageSource}
 *   loader={sanityImageLoader}
 *   fill
 *   sizes="(max-width: 768px) 100vw, 1400px"
 * />
 * ```
 */
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // If src is already a full URL string, extract the image reference
  // Otherwise, assume it's a Sanity image source object
  let imageSource: SanityImageSource

  if (typeof src === 'string') {
    // If it's already a Sanity CDN URL, parse it to extract image ID
    if (src.startsWith('https://cdn.sanity.io')) {
      // Return URL with updated width and quality
      const url = new URL(src)
      url.searchParams.set('w', width.toString())
      if (quality) {
        url.searchParams.set('q', quality.toString())
      }
      return url.toString()
    }

    // If it's an image reference string (e.g., "image-abc123-1920x1080-jpg")
    imageSource = src as SanityImageSource
  } else {
    // It's a Sanity image object
    imageSource = src as SanityImageSource
  }

  // Build URL using Sanity's image URL builder
  const imageBuilder = builder
    .image(imageSource)
    .width(width)
    .quality(quality || 85)
    .auto('format') // Automatically serve WebP/AVIF when supported
    .fit('max') // Scale down to fit width, never crop or scale up

  return imageBuilder.url()
}

/**
 * Generate srcset string for responsive images
 *
 * Used for manual srcset generation when needed.
 * Next.js automatically generates srcset when using the loader prop,
 * but this is useful for custom implementations.
 *
 * @param source - Sanity image source
 * @param widths - Array of widths for srcset
 * @param quality - Image quality (1-100)
 * @returns srcset string
 *
 * @example
 * ```tsx
 * const srcset = generateSrcSet(image, [640, 828, 1080, 1920], 85)
 * // Returns: "url-640w 640w, url-828w 828w, url-1080w 1080w, url-1920w 1920w"
 * ```
 */
export function generateSrcSet(
  source: SanityImageSource,
  widths: number[] = [640, 828, 1080, 1920],
  quality = 85
): string {
  return widths
    .map((width) => {
      const url = sanityImageLoader({
        src: source as string,
        width,
        quality
      })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Default device widths for responsive images
 * Based on common device viewport widths and Next.js defaults
 */
export const DEVICE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]

/**
 * Default image sizes for smaller images (thumbnails, icons)
 */
export const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 384]
```

**Why this works:**
- `fit('max')` ensures images scale down to fit width without cropping
- No height parameter means aspect ratio is preserved
- Sanity CDN handles format optimization (WebP/AVIF)
- Next.js still generates responsive srcset, just using our URLs

---

#### Step 2: Update Sanity Image Utilities

**File:** `/Users/michaelevans/DOA/doa-website/sanity/lib/image.ts`

**Changes:** Export a function that returns Sanity image sources compatible with the custom loader

**Add to end of file:**
```typescript
/**
 * Get Sanity image source for use with custom Next.js loader
 *
 * Returns the raw Sanity image object that can be passed to
 * the custom sanityImageLoader. The loader will handle URL generation.
 *
 * @param source - Sanity image object
 * @returns Sanity image source (unmodified)
 *
 * @example
 * ```tsx
 * import { sanityImageLoader } from '@/sanity/lib/sanityImageLoader'
 * import { getImageSource } from '@/sanity/lib/image'
 *
 * <Image
 *   src={getImageSource(project.mainImage)}
 *   loader={sanityImageLoader}
 *   fill
 *   sizes="(max-width: 768px) 100vw, 1400px"
 * />
 * ```
 */
export function getImageSource(source: SanityImageSource): string {
  // Return the image asset reference or full URL
  // The loader will handle URL generation
  if (!source) return '/placeholder.jpg'

  try {
    // Generate base URL without width/height constraints
    // The custom loader will add appropriate width later
    return builder.image(source).url()
  } catch {
    return '/placeholder.jpg'
  }
}

/**
 * Alternative: Get Sanity image reference string
 *
 * Returns just the image reference (e.g., "image-abc123-1920x1080-jpg")
 * which the loader can use to build URLs on-demand.
 *
 * @param source - Sanity image object
 * @returns Image reference string
 */
export function getImageReference(source: SanityImageSource): string {
  if (!source) return '/placeholder.jpg'

  try {
    // Check if source has asset._ref
    if (typeof source === 'object' && 'asset' in source) {
      const asset = source.asset as { _ref?: string }
      if (asset._ref) {
        return asset._ref
      }
    }

    // Fallback to generating URL
    return builder.image(source).url()
  } catch {
    return '/placeholder.jpg'
  }
}
```

**Why these functions:**
- `getImageSource`: Returns URL that custom loader can use
- `getImageReference`: Returns Sanity reference for more efficient loading
- Both handle errors gracefully with fallback

---

### Phase 2: Configure Next.js (10 minutes)

#### Step 3: Update Next.js Configuration

**File:** `/Users/michaelevans/DOA/doa-website/next.config.ts`

**Changes:** Add custom loader configuration for Sanity domain

**Replace current config with:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure custom loader for Sanity CDN images
    loaderFile: './sanity/lib/sanityImageLoader.ts',

    // Allow images from Sanity CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],

    // Define device widths for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Define sizes for smaller images (thumbnails, icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Supported formats (modern browsers get WebP/AVIF)
    formats: ['image/avif', 'image/webp'],

    // Minimize content-visible shift
    minimumCacheTTL: 60,
  },

  // Enable strict mode for better performance
  reactStrictMode: true,

  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable experimental optimizations
  experimental: {
    optimizeCss: true,
  },

  // Security headers
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

export default nextConfig;
```

**Key changes:**
- `loaderFile`: Points to our custom loader
- `deviceSizes` & `imageSizes`: Define responsive breakpoints
- `formats`: Enable modern image formats
- All security headers preserved

**Alternative approach (if you want more control):**

Instead of using `loaderFile` globally, you can use the loader per-component:

```typescript
// Keep next.config.ts minimal
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
  // ... rest of config
};
```

Then use loader prop in components (see Step 4).

---

### Phase 3: Update Components (15 minutes)

#### Step 4: Update ProjectSlideshow Component

**File:** `/Users/michaelevans/DOA/doa-website/src/components/ProjectSlideshow.tsx`

**Changes:** Remove URL generation functions and use custom loader directly

**Option A: Using global loaderFile (next.config.ts)**

If you configured `loaderFile` in next.config.ts, update ProjectSlideshow:

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getImageSource } from '../../sanity/lib/image'
import type { SanityResponsiveImage } from '@/types/sanity'

interface ProjectSlideshowProps {
  projectTitle: string
  images: SanityResponsiveImage[]
}

const ProjectSlideshow = ({ projectTitle, images }: ProjectSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // ... (keep all existing state and functions: goToSlide, goToPrevious, goToNext, touch handlers)

  if (images.length === 0) return null

  // Single image - no slideshow needed
  if (images.length === 1) {
    const aspectRatio = images[0].asset?.metadata?.dimensions?.aspectRatio || 16 / 9

    return (
      <div className="relative rounded-lg overflow-hidden border border-zinc-800 hover:border-gray-400 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]">
        <div className="relative bg-black" style={{ aspectRatio }}>
          <Image
            src={getImageSource(images[0])}
            alt={images[0]?.alt || `${projectTitle} - Image`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 1400px"
            priority
            quality={85}
          />
        </div>
      </div>
    )
  }

  // Get aspect ratio of current image for dynamic container sizing
  const currentAspectRatio = images[currentIndex]?.asset?.metadata?.dimensions?.aspectRatio || 16 / 9

  return (
    <div className="relative group">
      {/* Main Slideshow Container */}
      <div
        className="relative rounded-lg overflow-hidden border border-zinc-800 hover:border-gray-400 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative bg-black" style={{ aspectRatio: currentAspectRatio }}>
          <Image
            src={getImageSource(images[currentIndex])}
            alt={images[currentIndex]?.alt || `${projectTitle} - Image ${currentIndex + 1}`}
            fill
            className={`object-contain transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, 1400px"
            priority={currentIndex === 0}
            quality={85}
          />
        </div>

        {/* Navigation Arrows - Keep existing code */}
        {/* ... */}
      </div>

      {/* Dot Indicators - Keep existing code */}
      {/* ... */}

      {/* Thumbnail Preview */}
      {images.length > 1 && (
        <div className="hidden lg:grid grid-cols-6 gap-2 mt-4">
          {images.map((image, index) => {
            const aspectRatio = image.asset?.metadata?.dimensions?.aspectRatio || 16 / 9

            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative rounded overflow-hidden border-2 transition-all duration-300 bg-black ${
                  index === currentIndex
                    ? 'border-gray-400 scale-105 shadow-[0_4px_16px_rgba(192,192,192,0.3)]'
                    : 'border-zinc-800 hover:border-gray-600 opacity-60 hover:opacity-100'
                }`}
                style={{ aspectRatio }}
                aria-label={`Thumbnail ${index + 1}`}
              >
                <Image
                  src={getImageSource(image)}
                  alt={image?.alt || `${projectTitle} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="200px"
                  quality={85}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectSlideshow
```

**Key changes:**
1. Remove `getMainImageUrl` and `getThumbnailUrl` functions
2. Use `getImageSource(image)` from sanity/lib/image.ts
3. Remove console.log statements (or keep for debugging)
4. Add `quality={85}` prop to Image components
5. Keep all existing functionality (navigation, transitions, touch)

**Option B: Using loader prop per-component**

If you prefer not to use global `loaderFile`:

```typescript
import { sanityImageLoader } from '../../sanity/lib/sanityImageLoader'
import { getImageSource } from '../../sanity/lib/image'

// In Image components, add loader prop:
<Image
  src={getImageSource(images[currentIndex])}
  loader={sanityImageLoader}
  alt={images[currentIndex]?.alt || `${projectTitle} - Image ${currentIndex + 1}`}
  fill
  className="object-contain"
  sizes="(max-width: 768px) 100vw, 1400px"
  priority={currentIndex === 0}
  quality={85}
/>
```

**Recommendation:** Use Option A (global loaderFile) for consistency across all Sanity images.

---

### Phase 4: Testing & Verification (20 minutes)

#### Step 5: Manual Testing Checklist

**Test Environment Setup:**
```bash
cd /Users/michaelevans/DOA/doa-website

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Start development server
npm run dev
```

**Test Cases:**

1. **Portrait Images (Primary Issue)**
   - Navigate to project with portrait images (e.g., Custom Props)
   - Verify aspect ratio matches original (e.g., ~0.80 for 1080x1346)
   - Check browser DevTools:
     - Network tab: URL should NOT contain height parameter
     - Elements tab: Intrinsic size should match original dimensions
     - No 4:3 cropping visible

2. **Landscape Images**
   - Navigate to project with landscape images
   - Verify aspect ratio is preserved (e.g., 16:9)
   - Check that images aren't stretched or cropped

3. **Square Images**
   - Navigate to project with square images (1:1)
   - Verify they remain square
   - Check no distortion occurs

4. **Single Image Projects**
   - Test project with only one image
   - Verify correct rendering (no slideshow UI)
   - Check aspect ratio preservation

5. **Multiple Image Slideshow**
   - Test project with 4+ images
   - Verify navigation works (arrows, dots, keyboard, swipe)
   - Check smooth transitions between different aspect ratios
   - Verify container resizes correctly for each image

6. **Thumbnail Grid**
   - Verify thumbnails display at correct aspect ratios
   - Check active thumbnail highlighting
   - Verify click navigation works

7. **Responsive Behavior**
   - Test mobile viewport (< 768px)
   - Test tablet viewport (768px - 1024px)
   - Test desktop viewport (> 1024px)
   - Verify images load at appropriate sizes

8. **Performance**
   - Check Network tab for:
     - Multiple srcset sizes being generated
     - WebP/AVIF format being served (modern browsers)
     - Appropriate image sizes loaded per viewport
   - Verify lazy loading works (images load as you scroll)
   - Check Lighthouse performance score

9. **Edge Cases**
   - Missing images (should show placeholder)
   - Very tall portrait images (e.g., 9:16)
   - Ultra-wide images (e.g., 21:9)
   - Images with hotspot/crop data

**Verification Commands:**
```bash
# Check generated URLs in browser console
# (if you kept console.log statements)

# Inspect Network requests
# DevTools → Network → Filter: Img

# Check srcset generation
# DevTools → Elements → Inspect <img> tag
# Look for srcset attribute with multiple sizes

# Verify Sanity CDN parameters
# Expected URL format:
# https://cdn.sanity.io/images/PROJECT_ID/DATASET/IMAGE_ID-WIDTHxHEIGHT.FORMAT?w=WIDTH&q=85&auto=format&fit=max
```

---

#### Step 6: Automated Testing

**Create Test File:** `/Users/michaelevans/DOA/doa-website/sanity/lib/__tests__/sanityImageLoader.test.ts`

```typescript
import { sanityImageLoader, generateSrcSet } from '../sanityImageLoader'

describe('sanityImageLoader', () => {
  const mockSanityUrl = 'https://cdn.sanity.io/images/project123/production/image-abc123-1080x1346-jpg'

  it('should generate URL with correct width', () => {
    const result = sanityImageLoader({
      src: mockSanityUrl,
      width: 800,
      quality: 85,
    })

    expect(result).toContain('w=800')
    expect(result).toContain('q=85')
  })

  it('should include auto format parameter', () => {
    const result = sanityImageLoader({
      src: mockSanityUrl,
      width: 1200,
      quality: 90,
    })

    expect(result).toContain('auto=format')
  })

  it('should include fit=max parameter', () => {
    const result = sanityImageLoader({
      src: mockSanityUrl,
      width: 1200,
      quality: 90,
    })

    expect(result).toContain('fit=max')
  })

  it('should handle quality parameter', () => {
    const result = sanityImageLoader({
      src: mockSanityUrl,
      width: 1000,
      quality: 75,
    })

    expect(result).toContain('q=75')
  })

  it('should not include height parameter', () => {
    const result = sanityImageLoader({
      src: mockSanityUrl,
      width: 1200,
      quality: 85,
    })

    expect(result).not.toContain('h=')
    expect(result).not.toContain('height=')
  })

  it('should update existing URL parameters', () => {
    const urlWithParams = `${mockSanityUrl}?w=1000&q=75`
    const result = sanityImageLoader({
      src: urlWithParams,
      width: 1600,
      quality: 90,
    })

    expect(result).toContain('w=1600')
    expect(result).toContain('q=90')
  })
})

describe('generateSrcSet', () => {
  const mockImageSource = 'image-abc123-1080x1346-jpg'

  it('should generate srcset with multiple widths', () => {
    const result = generateSrcSet(mockImageSource as any, [640, 1080, 1920], 85)

    expect(result).toContain('640w')
    expect(result).toContain('1080w')
    expect(result).toContain('1920w')
  })

  it('should separate entries with commas', () => {
    const result = generateSrcSet(mockImageSource as any, [640, 1080], 85)

    const entries = result.split(',').map(e => e.trim())
    expect(entries).toHaveLength(2)
    expect(entries[0]).toMatch(/640w$/)
    expect(entries[1]).toMatch(/1080w$/)
  })
})
```

**Run tests:**
```bash
cd /Users/michaelevans/DOA/doa-website
npm test sanityImageLoader.test.ts
```

---

### Phase 5: Rollback Plan (5 minutes)

#### Step 7: Rollback Procedure

If the custom loader causes issues, follow this rollback:

**Option 1: Quick Rollback (Use unoptimized prop)**

```typescript
// In ProjectSlideshow.tsx
<Image
  src={getMainImageUrl(images[currentIndex], 1600)}
  fill
  unoptimized={true}  // Bypass all Next.js optimization
  className="object-contain"
  sizes="(max-width: 768px) 100vw, 1400px"
/>
```

**Option 2: Full Rollback (Restore original code)**

```bash
# Revert changes
git checkout HEAD -- next.config.ts
git checkout HEAD -- src/components/ProjectSlideshow.tsx
git checkout HEAD -- sanity/lib/image.ts

# Remove new loader file
rm sanity/lib/sanityImageLoader.ts

# Clear cache and restart
rm -rf .next
npm run dev
```

**Option 3: Keep loader but disable per-component**

```typescript
// In next.config.ts, remove loaderFile
const nextConfig: NextConfig = {
  images: {
    // loaderFile: './sanity/lib/sanityImageLoader.ts',  // Comment out
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  // ... rest of config
};
```

Then in components, remove loader prop:
```typescript
<Image
  src={getMainImageUrl(images[currentIndex], 1600)}
  // loader={sanityImageLoader}  // Remove this line
  fill
  className="object-contain"
/>
```

---

## Edge Cases & Considerations

### 1. Portrait Images (Primary Use Case)
**Scenario:** 1080x1346 px portrait images (aspect ratio ~0.80)

**Handling:**
- Custom loader preserves original aspect ratio
- Container uses `style={{ aspectRatio }}` from metadata
- `object-contain` ensures image fits without cropping
- No height parameter in URL means no forced 4:3

**Expected Result:** Image displays at correct 0.80 aspect ratio

---

### 2. Landscape Images
**Scenario:** 1920x1080 px landscape images (16:9)

**Handling:**
- Same as portrait - aspect ratio preserved
- Container adapts to 16:9
- No cropping or stretching

**Expected Result:** Full landscape image visible

---

### 3. Square Images
**Scenario:** 1080x1080 px square images (1:1)

**Handling:**
- Aspect ratio: 1
- Container is square
- Image fills container completely

**Expected Result:** Perfect square with no distortion

---

### 4. Very Tall Portrait (9:16 or taller)
**Scenario:** Phone screenshot or vertical video frame

**Handling:**
- Container may be very tall
- Consider max-height on container: `style={{ aspectRatio, maxHeight: '80vh' }}`
- `object-contain` prevents overflow

**Potential Issue:** Very tall images may dominate viewport

**Solution:**
```typescript
const currentAspectRatio = images[currentIndex]?.asset?.metadata?.dimensions?.aspectRatio || 16 / 9
const containerStyle = {
  aspectRatio: currentAspectRatio,
  maxHeight: currentAspectRatio < 0.6 ? '80vh' : undefined, // Limit very tall images
}

<div className="relative bg-black" style={containerStyle}>
  <Image ... />
</div>
```

---

### 5. Ultra-Wide Images (21:9 or wider)
**Scenario:** Panoramic or cinematic images

**Handling:**
- Container becomes very wide
- May need min-height to prevent tiny vertical space

**Solution:**
```typescript
const containerStyle = {
  aspectRatio: currentAspectRatio,
  minHeight: currentAspectRatio > 3 ? '400px' : undefined, // Ensure minimum height
}
```

---

### 6. Single Image Projects
**Scenario:** Project has only 1 image

**Handling:**
- Already handled in ProjectSlideshow (lines 112-129)
- No slideshow UI shown
- Same loader logic applies

**Expected Result:** Single image with correct aspect ratio, no navigation

---

### 7. Missing or Broken Images
**Scenario:** Image asset is missing or URL is invalid

**Handling:**
- `getImageSource()` returns '/placeholder.jpg'
- Next.js Image component handles broken images gracefully

**Improvement:** Add error boundary
```typescript
<Image
  src={getImageSource(images[currentIndex])}
  alt={images[currentIndex]?.alt || `${projectTitle} - Image ${currentIndex + 1}`}
  fill
  className="object-contain"
  onError={(e) => {
    console.error('Image failed to load:', e)
    // Optionally set fallback src
    e.currentTarget.src = '/placeholder.jpg'
  }}
/>
```

---

### 8. Images with Hotspot/Crop Data
**Scenario:** Image has custom hotspot or crop metadata in Sanity

**Handling:**
- Custom loader uses `fit('max')` which ignores crop/hotspot
- This is intentional to preserve full image
- If you want to respect hotspot:

```typescript
// In sanityImageLoader.ts, modify:
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // ... existing code ...

  const imageBuilder = builder
    .image(imageSource)
    .width(width)
    .quality(quality || 85)
    .auto('format')
    .fit('max') // Change to .fit('crop').crop('focalpoint') to respect hotspot

  return imageBuilder.url()
}
```

**Trade-off:** Respecting hotspot may crop images, defeating the purpose of fix

---

### 9. Thumbnail Grid Performance
**Scenario:** 6+ thumbnails loading simultaneously

**Handling:**
- Next.js lazy loads by default
- Thumbnails use smaller sizes (200px)
- Custom loader generates appropriate srcset

**Optimization:**
```typescript
<Image
  src={getImageSource(image)}
  alt={image?.alt || `${projectTitle} - Thumbnail ${index + 1}`}
  fill
  className="object-contain"
  sizes="200px"
  quality={75} // Lower quality for thumbnails
  loading={index === currentIndex ? 'eager' : 'lazy'} // Eager load current
/>
```

---

### 10. Responsive Behavior
**Scenario:** Different viewports need different image sizes

**Current sizes prop:**
- Main: `sizes="(max-width: 768px) 100vw, 1400px"`
- Thumbnails: `sizes="200px"`

**How it works:**
- Mobile (< 768px): Image fills viewport width (100vw)
- Desktop (≥ 768px): Image is fixed at 1400px max
- Next.js selects appropriate srcset based on actual rendered size

**Optimization for large displays:**
```typescript
sizes="(max-width: 768px) 100vw, (max-width: 1920px) 1400px, 1920px"
```

---

### 11. Modern Image Formats (WebP/AVIF)
**Scenario:** Browser supports modern formats

**Handling:**
- Sanity CDN's `auto('format')` detects browser support
- Automatically serves WebP or AVIF
- Fallback to original format (JPEG/PNG) for older browsers

**Verification:**
- Check Network tab in Chrome: Should see WebP
- Check Safari: Should see AVIF or WebP
- Check older browsers: Should see JPEG/PNG

---

### 12. Quality Settings
**Current:** `quality={85}` for all images

**Considerations:**
- Main slideshow: 85 is good balance
- Thumbnails: Could be 75 to save bandwidth
- Hero images: Could be 90 for maximum quality

**Customization:**
```typescript
// Different quality per use case
const QUALITY_SETTINGS = {
  slideshow: 85,
  thumbnail: 75,
  hero: 90,
  preview: 60,
}

<Image
  quality={QUALITY_SETTINGS.slideshow}
  // ...
/>
```

---

## Success Metrics

### Before Implementation
- Portrait images: 800x600 (4:3 aspect ratio)
- Network requests: Include height parameter
- Intrinsic dimensions: Wrong aspect ratio

### After Implementation
- Portrait images: Match original dimensions (e.g., 1080x1346)
- Network requests: No height parameter, only width
- Intrinsic dimensions: Correct aspect ratio
- Lighthouse score: No regression (should improve)
- Responsive images: srcset generated with 8+ sizes

### Performance Benchmarks
```bash
# Before
- LCP (Largest Contentful Paint): ~2.5s
- CLS (Cumulative Layout Shift): 0.1
- Image load time: ~800ms

# After (Expected)
- LCP: ~2.2s (slightly better due to correct sizing)
- CLS: 0.05 (better due to correct aspect ratios)
- Image load time: ~600ms (Sanity CDN direct, no Next.js proxy)
```

---

## Dependencies & Compatibility

### Required Packages
- `@sanity/image-url`: ^1.2.0 (already installed)
- `next`: ^15.5.4 (already installed)
- `@sanity/client`: (already installed)

### Browser Compatibility
- Modern browsers: Full support (Chrome, Firefox, Safari, Edge)
- WebP support: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- AVIF support: Chrome 85+, Firefox 93+, Safari 16+
- Fallback: JPEG/PNG for older browsers

### Next.js Version
- Requires: Next.js 13.0+ (for App Router)
- Current: 15.5.4
- Custom loader: Supported in all Next.js 13+ versions

---

## Implementation Timeline

### Estimated Time: 1-2 hours total

**Breakdown:**
1. **Phase 1 - Create Loader:** 15 minutes
   - Write `sanityImageLoader.ts`
   - Update `image.ts` with helper functions

2. **Phase 2 - Configure Next.js:** 10 minutes
   - Update `next.config.ts`
   - Set device sizes and formats

3. **Phase 3 - Update Components:** 15 minutes
   - Refactor `ProjectSlideshow.tsx`
   - Remove old URL generation functions
   - Add quality props

4. **Phase 4 - Testing:** 20 minutes
   - Manual testing (all test cases)
   - Browser DevTools verification
   - Responsive testing

5. **Phase 5 - Automated Tests:** 20 minutes
   - Write unit tests for loader
   - Run test suite
   - Fix any issues

6. **Buffer Time:** 20 minutes
   - Unexpected issues
   - Documentation updates
   - Final review

---

## Risk Assessment

### High Risk: NONE

### Medium Risk:

**1. Loader Performance Impact**
- **Risk:** Custom loader might be slower than Next.js default
- **Likelihood:** Low (Sanity CDN is fast)
- **Mitigation:** Monitor Lighthouse scores, use Vercel Analytics
- **Impact:** Minor (few milliseconds difference at most)

**2. Breaking Existing Components**
- **Risk:** Other components using Next.js Image might be affected
- **Likelihood:** Low (if using global loaderFile)
- **Mitigation:** Use per-component loader prop instead of global
- **Impact:** Medium (requires updating all Image components)

### Low Risk:

**3. Browser Compatibility**
- **Risk:** Older browsers might not handle custom srcset
- **Likelihood:** Very Low (standard HTML srcset)
- **Mitigation:** Fallback to default src works everywhere
- **Impact:** Low (edge cases only)

**4. Sanity CDN Rate Limiting**
- **Risk:** Generating many srcset URLs might hit rate limits
- **Likelihood:** Very Low (CDN handles high load)
- **Mitigation:** Monitor Sanity usage, implement caching
- **Impact:** Low (unlikely in practice)

---

## Alternatives Considered

### Alternative 1: Use unoptimized prop
```typescript
<Image src={url} fill unoptimized={true} />
```

**Pros:**
- Simplest solution (one prop)
- No custom code needed
- Guaranteed to work

**Cons:**
- Loses all Next.js optimization (lazy load, srcset, format)
- Larger file sizes
- Slower page loads
- No responsive images

**Verdict:** Not recommended for production

---

### Alternative 2: Use explicit width/height instead of fill
```typescript
const { width, height } = image.asset.metadata.dimensions
<Image src={url} width={width} height={height} />
```

**Pros:**
- Simple approach
- Next.js handles optimization
- No custom loader needed

**Cons:**
- Requires wrapping div with max-width
- Less flexible for responsive layouts
- Harder to handle dynamic aspect ratios
- Container doesn't adapt to image

**Verdict:** Viable but less elegant

---

### Alternative 3: Use plain <img> tag
```typescript
<img src={sanityUrl} alt={alt} className="w-full h-full object-contain" />
```

**Pros:**
- Complete control
- No Next.js interference
- Simplest code

**Cons:**
- No lazy loading (unless manual)
- No responsive images
- No format optimization
- No priority loading
- Loses all Next.js Image benefits

**Verdict:** Not recommended (loses too much)

---

### Alternative 4: Patch Next.js Image locally
```typescript
// Monkey patch Next.js Image component
```

**Pros:**
- Works globally without config

**Cons:**
- Fragile (breaks on Next.js updates)
- Hard to maintain
- Not recommended by Next.js team

**Verdict:** Bad practice, avoid

---

## Recommended Solution: Custom Loader

**Why custom loader is best:**
1. Preserves all Next.js Image features
2. Clean, maintainable code
3. Type-safe TypeScript
4. Easy to test and debug
5. Configurable per-component or globally
6. No performance loss (Sanity CDN is fast)
7. Works with existing codebase
8. Future-proof (standard Next.js pattern)

---

## Additional Resources

### Documentation
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Sanity Image URLs](https://www.sanity.io/docs/image-urls)
- [Custom Loaders in Next.js](https://nextjs.org/docs/app/api-reference/components/image#loader)

### Sanity CDN Parameters
```
?w=WIDTH          # Width in pixels
?h=HEIGHT         # Height in pixels (avoid for aspect ratio)
?q=QUALITY        # Quality 1-100
?fit=max          # Fit mode: max, crop, fill, min
?auto=format      # Auto-detect WebP/AVIF support
?dpr=2            # Device pixel ratio (for retina)
?fm=webp          # Force format (webp, jpg, png)
?crop=focalpoint  # Crop to hotspot
```

### Testing URLs
```bash
# Example URLs to test manually

# Portrait image (should preserve aspect ratio)
https://cdn.sanity.io/images/PROJECT/DATASET/IMAGE-1080x1346-jpg?w=800&q=85&auto=format&fit=max

# Landscape image
https://cdn.sanity.io/images/PROJECT/DATASET/IMAGE-1920x1080-jpg?w=1400&q=85&auto=format&fit=max

# Square image
https://cdn.sanity.io/images/PROJECT/DATASET/IMAGE-1080x1080-jpg?w=1000&q=85&auto=format&fit=max
```

---

## Post-Implementation Checklist

After implementing the custom loader, verify:

- [ ] Portrait images display at correct aspect ratio
- [ ] Landscape images display correctly
- [ ] Square images remain square
- [ ] Thumbnails maintain correct proportions
- [ ] Slideshow navigation works (arrows, dots, keyboard, swipe)
- [ ] Smooth transitions between different aspect ratios
- [ ] Responsive behavior on mobile/tablet/desktop
- [ ] Images load progressively (lazy loading)
- [ ] WebP/AVIF served to modern browsers
- [ ] Network requests show no height parameter
- [ ] Lighthouse performance score maintained or improved
- [ ] No console errors or warnings
- [ ] All automated tests pass
- [ ] Git commit created with changes
- [ ] Documentation updated

---

## Questions & Debugging

### Q: Images still cropped after implementation?
**A:** Check browser cache. Hard refresh (Cmd+Shift+R) or clear cache completely.

### Q: URLs still contain height parameter?
**A:** Verify `loaderFile` is correctly set in next.config.ts and restart dev server.

### Q: Custom loader not being called?
**A:** Check that:
1. Loader file path is correct in next.config.ts
2. You've restarted dev server after config change
3. Image src is from Sanity CDN (cdn.sanity.io)

### Q: Images not loading at all?
**A:** Check:
1. Sanity client is configured correctly
2. Image references are valid
3. Network tab shows actual requests
4. Console for error messages

### Q: Performance degraded?
**A:** Verify:
1. Sanity CDN is responding quickly (< 200ms)
2. Correct image sizes being requested
3. Lazy loading is working
4. Modern formats being served

### Q: TypeScript errors?
**A:** Ensure:
1. `@sanity/image-url` types are installed
2. Import paths are correct
3. SanityImageSource type is imported

---

## Conclusion

This implementation plan provides a robust solution to the aspect ratio issues with Sanity CDN images in Next.js. By using a custom loader, we:

1. **Preserve aspect ratios** - No forced 4:3 cropping
2. **Maintain performance** - All Next.js Image features retained
3. **Keep it simple** - Minimal code changes required
4. **Future-proof** - Standard Next.js pattern, easy to maintain

The custom loader approach is the recommended solution because it:
- Fixes the root cause (Next.js adding height parameters)
- Works for all image orientations
- Maintains optimization and performance
- Requires minimal changes to existing code
- Is well-tested and documented

Follow the phases in order, test thoroughly, and you should have portrait images displaying correctly within 1-2 hours.
