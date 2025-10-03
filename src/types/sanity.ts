/**
 * Sanity CMS Type Definitions
 *
 * Type definitions for Sanity image objects, document types, and related structures.
 * These types match the Sanity schema structure and support hotspot/crop functionality.
 */

// ============================================================================
// Image-Related Interfaces
// ============================================================================

/**
 * Hotspot data for smart image cropping
 *
 * Defines the focal point of an image for responsive cropping.
 * Values are normalized (0-1) relative to image dimensions.
 */
export interface SanityImageHotspot {
  x: number
  y: number
  height: number
  width: number
}

/**
 * Crop data for image trimming
 *
 * Defines how much to crop from each edge of the image.
 * Values are normalized (0-1) relative to image dimensions.
 */
export interface SanityImageCrop {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * Sanity image asset metadata
 */
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
    lqip?: string // Low Quality Image Placeholder
    palette?: {
      dominant?: {
        background?: string
        foreground?: string
      }
    }
  }
}

/**
 * Responsive image type with hotspot and crop support
 *
 * This is the primary image type used throughout the application.
 * Includes asset reference, hotspot data, and descriptive fields.
 */
export interface SanityResponsiveImage {
  _type: 'responsiveImage'
  asset: SanityImageAsset
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
  alt: string
  caption?: string
}

// ============================================================================
// Document Type Interfaces
// ============================================================================

/**
 * Project document type
 *
 * Represents a portfolio project with images, description, and metadata.
 */
export interface Project {
  _id: string
  _type: 'project'
  title: string
  slug?: {
    current: string
  }
  client?: string
  mainImage?: SanityResponsiveImage
  gallery?: SanityResponsiveImage[]
  description?: string
  year?: number
  category?: string
  type?: string
  order?: number
  featured?: boolean
  credits?: {
    director?: string
    productionDesigner?: string
    cinematographer?: string
  }
  technicalDetails?: {
    squareFeet?: number
    buildDuration?: string
    specialFeatures?: string[]
  }
}

/**
 * Team member document type
 *
 * Represents a team member with photo and biographical information.
 */
export interface TeamMember {
  _id: string
  _type: 'teamMember'
  name: string
  role?: string
  bio?: string
  photo?: SanityResponsiveImage
  imdbUrl?: string
  linkedinUrl?: string
  email?: string
  order?: number
}

/**
 * Client document type
 *
 * Represents a client with logo images (standard and white versions).
 */
export interface Client {
  _id: string
  _type: 'client'
  name: string
  logo?: SanityResponsiveImage
  logoWhite?: SanityResponsiveImage
  website?: string
  description?: string
  order?: number
  featured?: boolean
}

/**
 * Testimonial document type
 *
 * Represents client testimonials with optional author photo.
 */
export interface Testimonial {
  _id: string
  _type: 'testimonial'
  name: string
  role?: string
  company?: string
  quote: string
  photo?: SanityResponsiveImage
  rating?: number
  order?: number
  featured?: boolean
}

/**
 * Service document type
 *
 * Represents a service offering with optional icon/image.
 */
export interface Service {
  _id: string
  _type: 'service'
  title: string
  description?: string
  icon?: SanityResponsiveImage
  features?: string[]
  order?: number
}

// ============================================================================
// Page Settings Types
// ============================================================================

/**
 * Homepage settings document
 *
 * Configuration for homepage content including hero images.
 */
export interface HomepageSettings {
  _id: string
  _type: 'homepageSettings'
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: SanityResponsiveImage
  featuredProjects?: Project[]
  featuredClients?: Client[]
}

/**
 * About page document
 *
 * Content for the about page including hero and team images.
 */
export interface AboutPage {
  _id: string
  _type: 'aboutPage'
  title?: string
  heroImage?: SanityResponsiveImage
  description?: string
  teamMembers?: TeamMember[]
  timeline?: Array<{
    year: number
    title: string
    description: string
  }>
}

/**
 * Site settings document
 *
 * Global site configuration including logos and social images.
 */
export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  title?: string
  description?: string
  logo?: SanityResponsiveImage
  favicon?: SanityResponsiveImage
  ogImage?: SanityResponsiveImage
  keywords?: string[]
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic Sanity document reference
 */
export interface SanityReference {
  _ref: string
  _type: 'reference'
}

/**
 * Portable Text block types (for rich text content)
 */
export interface PortableTextBlock {
  _key: string
  _type: 'block'
  children: Array<{
    _key: string
    _type: 'span'
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _key: string
    _type: string
    [key: string]: unknown
  }>
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
  level?: number
  listItem?: 'bullet' | 'number'
}

/**
 * Union type of all Sanity document types
 */
export type SanityDocument =
  | Project
  | TeamMember
  | Client
  | Testimonial
  | Service
  | HomepageSettings
  | AboutPage
  | SiteSettings
