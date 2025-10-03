import { Metadata } from 'next'
import { client } from '../../sanity/lib/client'
import { siteSettingsQuery } from '../../sanity/lib/queries'
import { urlForWithOptions } from '../../sanity/lib/image'
import type { SanityResponsiveImage } from '@/types/sanity'

/**
 * Generate Open Graph image URL for social sharing
 * Uses standard 1200x630 dimensions (1.91:1 aspect ratio) for optimal social media display
 *
 * @param image - Sanity image object with hotspot data
 * @returns Optimized image URL for Open Graph metadata
 */
export function getOgImageUrl(image: SanityResponsiveImage): string {
  return urlForWithOptions(image, {
    width: 1200,
    height: 630,
    quality: 90,
    auto: 'format',
  }).url()
}

export async function getSiteMetadata(): Promise<Metadata> {
  try {
    const settings = await client.fetch(siteSettingsQuery)
    
    const metaTitle = settings?.seo?.metaTitle || settings?.title || 'Department of Art'
    const metaDescription = settings?.seo?.metaDescription || settings?.description || 'Professional set construction services for the entertainment industry'
    const siteUrl = settings?.seo?.siteUrl || 'https://departmentofart.com'
    
    // Generate image URL if social image exists
    let socialImageUrl = '/doa-logo.png' // Using existing DOA logo as fallback
    if (settings?.seo?.socialImage) {
      try {
        socialImageUrl = getOgImageUrl(settings.seo.socialImage)
      } catch {
        // Fallback to default if image processing fails
      }
    }
    
    return {
      title: {
        default: metaTitle,
        template: `%s | ${metaTitle}`,
      },
      description: metaDescription,
      metadataBase: new URL(siteUrl),
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: siteUrl,
        siteName: metaTitle,
        images: [
          {
            url: socialImageUrl,
            width: 1200,
            height: 630,
            alt: metaTitle,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: settings?.seo?.twitterCard || 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [socialImageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch (error) {
    console.error('Error fetching site metadata:', error)
    
    // Return fallback metadata if fetch fails
    return {
      title: 'Department of Art',
      description: 'Professional set construction services for the entertainment industry',
      metadataBase: new URL('https://departmentofart.com'),
    }
  }
}