// Application constants for the DOA project

export const APP_CONFIG = {
  name: 'Department of Art',
  description: 'Professional set construction and design for film, TV, and commercial productions',
  url: 'https://doa-construction.com',
  email: 'info@doa-construction.com',
  phone: '(503) 555-0123',
  address: {
    street: '123 Industrial Ave',
    city: 'Portland',
    state: 'OR',
    zip: '97210',
  },
} as const;

export const NAVIGATION_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#services', label: 'Services' },
  { href: '#clients', label: 'Clients' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;

export const PROJECT_CATEGORIES = [
  'film',
  'tv',
  'commercial',
  'music-video',
  'theater',
] as const;

export const SERVICE_TYPES = [
  'set-construction',
  'set-destruction',
  'prop-building',
  'location-scouting',
  'consultation',
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/doa_construction',
  facebook: 'https://facebook.com/doaconstruction',
  linkedin: 'https://linkedin.com/company/doa-construction',
  youtube: 'https://youtube.com/@doaconstruction',
} as const;

export const CONTACT_FORM_FIELDS = {
  name: {
    label: 'Name',
    placeholder: 'Your name',
    required: true,
    type: 'text',
  },
  email: {
    label: 'Email',
    placeholder: 'your.email@example.com',
    required: true,
    type: 'email',
  },
  phone: {
    label: 'Phone',
    placeholder: '(555) 123-4567',
    required: false,
    type: 'tel',
  },
  company: {
    label: 'Company',
    placeholder: 'Your production company',
    required: false,
    type: 'text',
  },
  projectType: {
    label: 'Project Type',
    required: true,
    type: 'select',
    options: [
      { value: 'film', label: 'Film' },
      { value: 'tv', label: 'Television' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'music-video', label: 'Music Video' },
      { value: 'theater', label: 'Theater' },
      { value: 'other', label: 'Other' },
    ],
  },
  message: {
    label: 'Message',
    placeholder: 'Tell us about your project...',
    required: true,
    type: 'textarea',
  },
} as const;

export const THEME_COLORS = {
  primary: '#d4af37', // doa-gold
  secondary: '#f5f5f5', // doa-light-gray
  accent: '#d4af37', // doa-gold
  background: '#000000', // black
  surface: '#1A1A1A', // dark gray
  text: '#FFFFFF', // white
  textMuted: '#CCCCCC',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '1000ms',
} as const;

export const API_ENDPOINTS = {
  contact: '/api/contact',
  projects: '/api/projects',
  testimonials: '/api/testimonials',
  newsletter: '/api/newsletter',
} as const;

export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
} as const;

export const SUCCESS_MESSAGES = {
  contactForm: 'Thank you for your message! We\'ll get back to you soon.',
  newsletter: 'Successfully subscribed to our newsletter!',
  formSaved: 'Your information has been saved.',
} as const;

export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

export const LOCAL_STORAGE_KEYS = {
  theme: 'doa-theme',
  contactForm: 'doa-contact-form',
  preferences: 'doa-preferences',
} as const;

export const SEO_DEFAULTS = {
  title: 'Department of Art - Professional Set Construction & Design',
  description: 'Expert set construction and design services for film, TV, and commercial productions in Portland, Oregon. Craftsmanship meets creativity.',
  keywords: [
    'set construction',
    'set design',
    'film production',
    'TV production',
    'commercial production',
    'Portland',
    'Oregon',
    'prop building',
    'production services',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Department of Art',
  },
} as const;

export const TESTIMONIAL_RATINGS = {
  min: 1,
  max: 5,
  default: 5,
} as const;

export const PROJECT_FILTERS = {
  all: 'All Projects',
  film: 'Film',
  tv: 'Television',
  commercial: 'Commercial',
  'music-video': 'Music Videos',
  theater: 'Theater',
} as const;

export const PROFESSIONAL_ICONS = [
  '🎬',
  '🎭',
  '🏗️',
  '🎨',
  '📐',
  '🔨',
  '⭐',
  '🎪',
  '🏛️',
  '🎯',
] as const;