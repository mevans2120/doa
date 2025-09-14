import { Metadata } from 'next'
import { client } from '../../sanity/lib/client'
import { siteSettingsQuery } from '../../sanity/lib/queries'
import { urlFor } from '../../sanity/lib/image'

export async function getSiteMetadata(): Promise<Metadata> {
  try {
    const settings = await client.fetch(siteSettingsQuery)
    
    const metaTitle = settings?.seo?.metaTitle || settings?.title || 'Department of Art'
    const metaDescription = settings?.seo?.metaDescription || settings?.description || 'Professional set construction services for the entertainment industry'
    const siteUrl = settings?.seo?.siteUrl || 'https://departmentofart.com'
    
    // Generate image URL if social image exists
    let socialImageUrl = '/social-image.png'
    if (settings?.seo?.socialImage) {
      try {
        socialImageUrl = urlFor(settings.seo.socialImage).width(1200).height(630).url()
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