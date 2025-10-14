import { groq } from 'next-sanity'

// Email Settings query - get the most recently updated one
export const emailSettingsQuery = groq`*[_type == "emailSettings"] | order(_updatedAt desc)[0]`

// Project queries
export const projectsQuery = groq`*[_type == "project"] | order(order asc, _createdAt desc) {
  _id,
  title,
  client,
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  gallery[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  description,
  featured,
  year
}`

export const featuredProjectsQuery = groq`*[_type == "project" && featured == true] | order(order asc) [0...6] {
  _id,
  title,
  client,
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  gallery[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  description,
  year
}`

export const projectDetailQuery = groq`*[_type == "project" && _id == $id][0] {
  _id,
  title,
  client,
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  gallery[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  description,
  year
}`

// Client queries
export const clientsQuery = groq`*[_type == "client"] | order(order asc, name asc) {
  _id,
  name,
  type,
  logo,
  logoWhite,
  website,
  featured,
  featuredOnHomepage
}`

export const featuredClientsQuery = groq`*[_type == "client" && featuredOnHomepage == true] | order(order asc) [0...12] {
  _id,
  name,
  type,
  logo,
  logoWhite
}`

// Separate queries for clients and collaborators
export const regularClientsQuery = groq`*[_type == "client" && type == "client"] | order(order asc, name asc) {
  _id,
  name,
  logo,
  logoWhite,
  website,
  featured
}`

export const collaboratorsQuery = groq`*[_type == "client" && type == "collaborator"] | order(order asc, name asc) {
  _id,
  name,
  logo,
  logoWhite,
  website,
  featured
}`

// Testimonial queries
export const testimonialsQuery = groq`*[_type == "testimonial"] | order(order asc, _createdAt desc) {
  _id,
  quote,
  author,
  role,
  company,
  featured
}`

export const featuredTestimonialsQuery = groq`*[_type == "testimonial" && featured == true] | order(order asc) [0...4] {
  _id,
  title,
  quote,
  author,
  role,
  company
}`

// Service queries
export const servicesQuery = groq`*[_type == "service"] | order(order asc, _createdAt desc) {
  _id,
  title,
  shortDescription,
  iconType,
  featured
}`

// Services page query - get the most recently updated one
export const servicesPageQuery = groq`*[_type == "servicesPage"] | order(_updatedAt desc)[0] {
  pageTitle,
  seo
}`

// Projects page query - get the most recently updated one
export const projectsPageQuery = groq`*[_type == "projectsPage"] | order(_updatedAt desc)[0] {
  pageTitle,
  pageDescription,
  seo
}`

// Team member queries
export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc, _createdAt desc) {
  _id,
  name,
  role,
  bio,
  photo,
  imdbUrl
}`

// Site settings query - get the most recently updated one
export const siteSettingsQuery = groq`*[_type == "siteSettings"] | order(_updatedAt desc)[0] {
  title,
  description,
  seo,
  heroTitle,
  heroSubtitle,
  contactEmail,
  contactPhone,
  address,
  businessHours,
  footer,
  navigation
}`

// Homepage settings query - get the most recently updated one
export const homepageSettingsQuery = groq`*[_type == "homepageSettings"] | order(_updatedAt desc)[0] {
  heroSection,
  sectionTitles,
  aboutCTA,
  seo
}`

// About page query - get the most recently updated one
export const aboutPageQuery = groq`*[_type == "aboutPage"] | order(_updatedAt desc)[0] {
  title,
  tagline,
  heroTitle,
  companyOverview,
  companyImage,
  missionTitle,
  missionText,
  visionTitle,
  visionText,
  storyTitle,
  storyContent,
  storyImage,
  teamSectionTitle,
  seo
}`

// Contact page query - get the most recently updated one
export const contactPageQuery = groq`*[_type == "contactPage"] | order(_updatedAt desc)[0] {
  title,
  hero,
  contactForm,
  studioInfo,
  seo
}`