import { groq } from 'next-sanity'

// Email Settings query
export const emailSettingsQuery = groq`*[_type == "emailSettings"][0]`

// Project queries
export const projectsQuery = groq`*[_type == "project"] | order(order asc, _createdAt desc) {
  _id,
  title,
  slug,
  client,
  category,
  type,
  mainImage,
  gallery,
  description,
  featured,
  year,
  credits,
  technicalDetails
}`

export const featuredProjectsQuery = groq`*[_type == "project" && featured == true] | order(order asc) [0...6] {
  _id,
  title,
  slug,
  client,
  category,
  type,
  mainImage,
  description,
  year
}`

export const projectDetailQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  client,
  category,
  type,
  mainImage,
  gallery,
  description,
  year,
  credits,
  technicalDetails
}`

// Client queries
export const clientsQuery = groq`*[_type == "client"] | order(order asc, name asc) {
  _id,
  name,
  logo,
  logoWhite,
  website,
  featured
}`

export const featuredClientsQuery = groq`*[_type == "client" && featured == true] | order(order asc) [0...12] {
  _id,
  name,
  logo,
  logoWhite
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
  slug,
  shortDescription,
  icon
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

// Site settings query
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  title,
  description,
  seo,
  heroTitle,
  heroSubtitle,
  contactEmail,
  contactPhone,
  address,
  footer,
  navigation,
  socialMedia
}`

// Homepage settings query
export const homepageSettingsQuery = groq`*[_type == "homepageSettings"][0] {
  heroSection,
  sectionTitles,
  aboutCTA,
  seo
}`

// About page query
export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
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

// Contact page query
export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  title,
  hero,
  contactForm,
  studioInfo,
  seo
}`