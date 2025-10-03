# Image Helpers Quick Reference Guide

## Overview

The DOA website uses enhanced Sanity image helpers that automatically handle aspect ratio cropping, quality optimization, and hotspot support.

---

## Available Functions

### `landscapeImage(source, width?)`

Creates landscape-oriented images with 16:9 aspect ratio.

**Use Cases**: Project hero images, gallery images, feature images

```typescript
import { landscapeImage } from '@/sanity/lib/image'

// Default width (1200px)
<img src={landscapeImage(project.mainImage).url()} alt={project.mainImage.alt} />

// Custom width
<img src={landscapeImage(project.mainImage, 1600).url()} alt={project.mainImage.alt} />
```

**Generates**: Width specified, height calculated (width / 1.778), quality 85, auto-format

---

### `portraitImage(source, width?)`

Creates portrait-oriented images with 4:5 aspect ratio.

**Use Cases**: Team member photos, portrait photography

```typescript
import { portraitImage } from '@/sanity/lib/image'

// Default width (600px)
<img src={portraitImage(member.photo).url()} alt={member.photo.alt} />

// Custom width
<img src={portraitImage(member.photo, 400).url()} alt={member.photo.alt} />
```

**Generates**: Width specified, height calculated (width / 0.8), quality 85, auto-format

---

### `squareImage(source, width?)`

Creates square images with 1:1 aspect ratio.

**Use Cases**: Logos, avatars, icons

```typescript
import { squareImage } from '@/sanity/lib/image'

// Default width (400px)
<img src={squareImage(client.logo).url()} alt={client.name} />

// Custom width
<img src={squareImage(client.logo, 200).url()} alt={client.name} />
```

**Generates**: Width and height equal, quality 85, auto-format

---

### `urlForWithOptions(source, options)`

Advanced image URL builder with custom options.

**Use Cases**: Custom aspect ratios, specific dimensions, Open Graph images

```typescript
import { urlForWithOptions } from '@/sanity/lib/image'

// Open Graph image (1200x630)
const ogImage = urlForWithOptions(image, {
  width: 1200,
  height: 630,
  quality: 90,
  auto: 'format'
}).url()

// Custom aspect ratio
const customImage = urlForWithOptions(image, {
  width: 800,
  aspectRatio: '16:9',
  quality: 85,
  auto: 'format'
}).url()

// No cropping (original)
const originalImage = urlForWithOptions(image, {
  width: 1000,
  aspectRatio: 'original',
  quality: 90,
  auto: 'format'
}).url()
```

**Options**:
- `width?: number` - Target width in pixels
- `height?: number` - Target height in pixels
- `aspectRatio?: '16:9' | '4:5' | '1:1' | 'original'` - Aspect ratio for cropping
- `quality?: number` - Image quality (0-100)
- `auto?: 'format'` - Enable auto-format detection (WebP, AVIF)

---

### `urlFor(source)` (Legacy)

Basic image URL builder for backward compatibility.

**Use Cases**: When you need fine-grained control or gradual migration

```typescript
import { urlFor } from '@/sanity/lib/image'

<img src={urlFor(image).width(800).height(600).url()} alt="Example" />
```

---

## TypeScript Types

### Import Types

```typescript
import type {
  SanityResponsiveImage,
  Project,
  TeamMember,
  Client,
  SanityImageHotspot,
  SanityImageCrop
} from '@/types/sanity'

import type {
  AspectRatio,
  ImageUrlOptions
} from '@/sanity/lib/image'
```

### Using Types

```typescript
interface ComponentProps {
  image: SanityResponsiveImage
  project: Project
}

function MyComponent({ image, project }: ComponentProps) {
  return (
    <>
      <img src={landscapeImage(image, 800).url()} alt={image.alt} />
      <img src={landscapeImage(project.mainImage, 600).url()} alt={project.mainImage.alt} />
    </>
  )
}
```

---

## Common Patterns

### Responsive Images

```typescript
// Multiple sizes for srcset
<img
  srcSet={`
    ${landscapeImage(image, 400).url()} 400w,
    ${landscapeImage(image, 800).url()} 800w,
    ${landscapeImage(image, 1200).url()} 1200w,
    ${landscapeImage(image, 1600).url()} 1600w
  `}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  src={landscapeImage(image, 1200).url()}
  alt={image.alt}
/>
```

### Gallery with Mixed Orientations

```typescript
import { urlForWithOptions } from '@/sanity/lib/image'

function Gallery({ images }: { images: SanityResponsiveImage[] }) {
  return (
    <div className="gallery">
      {images.map((image) => {
        // Detect orientation from metadata
        const isPortrait = image.asset?.metadata?.dimensions?.aspectRatio < 1
        const aspectRatio = isPortrait ? '4:5' : '16:9'

        return (
          <img
            key={image.asset._id}
            src={urlForWithOptions(image, {
              width: 800,
              aspectRatio,
              quality: 85,
              auto: 'format'
            }).url()}
            alt={image.alt}
          />
        )
      })}
    </div>
  )
}
```

### Low Quality Image Placeholder (LQIP)

```typescript
function ImageWithPlaceholder({ image }: { image: SanityResponsiveImage }) {
  const lqip = image.asset?.metadata?.lqip

  return (
    <img
      src={landscapeImage(image, 1200).url()}
      alt={image.alt}
      style={{ backgroundImage: lqip ? `url(${lqip})` : undefined }}
      loading="lazy"
    />
  )
}
```

### Alt Text with Fallback

```typescript
function ProjectCard({ project }: { project: Project }) {
  return (
    <img
      src={landscapeImage(project.mainImage, 600).url()}
      alt={project.mainImage?.alt || project.title}
    />
  )
}
```

---

## Best Practices

### 1. Always Use Alt Text
```typescript
// Good
<img src={landscapeImage(image, 800).url()} alt={image.alt} />

// Bad
<img src={landscapeImage(image, 800).url()} />
```

### 2. Choose Appropriate Aspect Ratios
- **16:9 (Landscape)**: Projects, hero sections, feature images
- **4:5 (Portrait)**: Team photos, portrait photography
- **1:1 (Square)**: Logos, avatars, icons

### 3. Use Appropriate Widths
- **Thumbnails**: 400-600px
- **Cards**: 600-800px
- **Hero Images**: 1200-1600px
- **Full Width**: 1600-2000px

### 4. Enable Auto-Format
All convenience functions include `auto: 'format'` by default for WebP/AVIF support.

### 5. Optimize Quality
- **Default**: 85 (good balance)
- **High quality**: 90-95 (larger file size)
- **Thumbnails**: 75-80 (smaller file size)

---

## Hotspot Support

All aspect ratio functions use focalpoint cropping, which respects the hotspot set in Sanity Studio.

**Setting Hotspots in Sanity Studio**:
1. Upload or select an image
2. Click "Edit" button
3. Click "Hotspot" in the toolbar
4. Drag the circle to the most important part of the image
5. Save changes

**How It Works**:
- The hotspot defines the focal point of the image
- When cropping to different aspect ratios, the system keeps the hotspot in frame
- Ensures important subjects (faces, products, etc.) stay visible

---

## Migration Guide

### From Old urlFor to New Helpers

```typescript
// Before
import { urlFor } from '@/sanity/lib/image'
<img src={urlFor(image).width(800).url()} alt="..." />

// After
import { landscapeImage } from '@/sanity/lib/image'
<img src={landscapeImage(image, 800).url()} alt="..." />
```

### Benefits of Migration
- Automatic aspect ratio handling
- Hotspot support enabled
- Quality optimization included
- Consistent image dimensions across the site

---

## Troubleshooting

### Images Not Cropping Correctly
- Verify hotspot is set in Sanity Studio
- Check that aspect ratio is specified
- Ensure image has valid asset data

### TypeScript Errors
- Import types from `@/types/sanity`
- Ensure image object includes required fields (asset, alt)
- Check optional fields are accessed safely (use `?` operator)

### URLs Not Generated
- Verify Sanity client is properly configured
- Check image asset ID format is valid
- Ensure image object is not null/undefined

---

## Further Reading

- [Sanity Image URL Documentation](https://www.sanity.io/docs/image-url)
- [Image Cropping Implementation Plan](/Users/michaelevans/DOA/memory-bank/IMAGE_CROPPING_PLAN.md)
- [Phase 2 Completion Report](/Users/michaelevans/DOA/memory-bank/PHASE_2_COMPLETION_REPORT.md)

---

**Last Updated**: 2025-10-02
**Version**: 1.0
