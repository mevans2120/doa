import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

/**
 * Aspect ratio types for image cropping
 */
export type AspectRatio = '16:9' | '4:5' | '1:1' | 'original'

/**
 * Mapping of aspect ratio strings to numeric values
 */
const ASPECT_RATIOS: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '4:5': 4 / 5,
  '1:1': 1,
  'original': 0, // No cropping
}

/**
 * Options for building image URLs with specific dimensions and quality
 */
export interface ImageUrlOptions {
  width?: number
  height?: number
  aspectRatio?: AspectRatio
  quality?: number
  auto?: 'format'
}

/**
 * Basic image URL builder (backward compatible)
 *
 * @param source - Sanity image object
 * @returns Image URL builder instance
 *
 * @example
 * ```tsx
 * <img src={urlFor(image).width(800).url()} alt="Example" />
 * ```
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Advanced image URL builder with aspect ratio and quality options
 *
 * Automatically applies:
 * - Width and height constraints
 * - Aspect ratio cropping with hotspot support
 * - Quality optimization
 * - Auto-format detection
 *
 * @param source - Sanity image object with optional hotspot data
 * @param options - Configuration options for image URL
 * @returns Image URL builder instance
 *
 * @example
 * ```tsx
 * <img
 *   src={urlForWithOptions(image, {
 *     width: 800,
 *     aspectRatio: '16:9',
 *     quality: 85,
 *     auto: 'format'
 *   }).url()}
 *   alt="Example"
 * />
 * ```
 */
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
    // Use focal point from hotspot for smart cropping
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

/**
 * Creates a landscape-oriented image URL (16:9 aspect ratio)
 *
 * Uses the image's hotspot to determine focal point for cropping.
 * Automatically applies quality optimization and format detection.
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
  return urlForWithOptions(source, {
    width,
    aspectRatio: '16:9',
    quality: 85,
    auto: 'format',
  })
}

/**
 * Creates a portrait-oriented image URL (4:5 aspect ratio)
 *
 * Ideal for team member photos and portrait photography.
 * Uses the image's hotspot to determine focal point for cropping.
 *
 * @param source - Sanity image object with hotspot data
 * @param width - Target width in pixels (default: 600)
 * @returns Image URL builder instance
 *
 * @example
 * ```tsx
 * <img
 *   src={portraitImage(member.photo, 400).url()}
 *   alt={member.photo.alt}
 * />
 * ```
 */
export function portraitImage(source: SanityImageSource, width = 600) {
  return urlForWithOptions(source, {
    width,
    aspectRatio: '4:5',
    quality: 85,
    auto: 'format',
  })
}

/**
 * Creates a square image URL (1:1 aspect ratio)
 *
 * Perfect for logos, avatars, and icons.
 * Uses the image's hotspot to determine focal point for cropping.
 *
 * @param source - Sanity image object with hotspot data
 * @param width - Target width in pixels (default: 400)
 * @returns Image URL builder instance
 *
 * @example
 * ```tsx
 * <img
 *   src={squareImage(client.logo, 200).url()}
 *   alt={client.logo.alt}
 * />
 * ```
 */
export function squareImage(source: SanityImageSource, width = 400) {
  return urlForWithOptions(source, {
    width,
    aspectRatio: '1:1',
    quality: 85,
    auto: 'format',
  })
}

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
