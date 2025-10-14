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
    // If it's a local path (starts with / or ./) return as-is
    if (src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
      return src
    }

    // If it's already a Sanity CDN URL, parse it to extract image ID
    if (src.startsWith('https://cdn.sanity.io') || src.startsWith('http://cdn.sanity.io')) {
      // Return URL with updated width and quality
      const url = new URL(src)
      url.searchParams.set('w', width.toString())
      if (quality) {
        url.searchParams.set('q', quality.toString())
      }
      return url.toString()
    }

    // If it's any other absolute URL, return as-is
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src
    }

    // If it's an image reference string (e.g., "image-abc123-1920x1080-jpg")
    imageSource = src as SanityImageSource
  } else {
    // It's a Sanity image object
    imageSource = src as SanityImageSource
  }

  // Build URL using Sanity's image URL builder
  try {
    // When an image has crop metadata in Sanity, we should only specify width
    // and let Sanity CDN calculate the correct height based on the crop's aspect ratio
    const imageBuilder = builder
      .image(imageSource)
      .width(width)
      .quality(quality || 85)
      .auto('format') // Automatically serve WebP/AVIF when supported
      // Don't use .fit() or .height() - let Sanity respect the crop metadata

    return imageBuilder.url()
  } catch (error) {
    // If Sanity builder fails, return src as-is
    console.error('Sanity image loader error:', error)
    return typeof src === 'string' ? src : '/placeholder.jpg'
  }
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

// Default export required by Next.js loaderFile config
export default sanityImageLoader
