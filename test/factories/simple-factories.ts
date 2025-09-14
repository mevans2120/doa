// Simplified factories without external dependencies to avoid ESM issues

export interface MockService {
  _id: string
  title: string
  slug?: { current: string }
  shortDescription: string
  iconType?: string
  category?: string
  order: number
  featured?: boolean
}

export interface MockProject {
  _id: string
  title: string
  slug?: { current: string }
  client?: string
  category?: string
  type?: string
  mainImage?: { _type: string; asset: { _ref: string; _type: string } }
  gallery?: Array<{ _type: string; asset: { _ref: string; _type: string }; _key?: string }>
  description?: string
  featured?: boolean
  year?: number
}

export interface MockTestimonial {
  _id: string
  title?: string
  quote: string
  author: string
  role?: string
  company?: string
  featured?: boolean
}

export interface MockClient {
  _id: string
  name: string
  logo?: { _type: string; asset: { _ref: string; _type: string } }
  logoWhite?: { _type: string; asset: { _ref: string; _type: string } }
  featured?: boolean
}

export interface MockHomepageSettings {
  heroSection?: {
    mainTitle?: string
    subtitle?: string
    showLogo?: boolean
  }
  sectionTitles?: {
    featuredProjects?: string
    whatWeDo?: string
    ourClients?: string
    testimonials?: string
  }
  aboutCTA?: {
    heading?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
}

// Factory functions
export const createMockService = (overrides: Partial<MockService> = {}): MockService => ({
  _id: `service-${Date.now()}-${Math.random()}`,
  title: 'Test Service',
  slug: { current: 'test-service' },
  shortDescription: 'Test service description',
  iconType: 'tools',
  category: 'production',
  order: 0,
  featured: false,
  ...overrides,
})

export const createMockServiceList = (count = 5, overrides: Partial<MockService> = {}): MockService[] => 
  Array.from({ length: count }, (_, i) => createMockService({
    _id: `service-${i}`,
    title: `Service ${i + 1}`,
    slug: { current: `service-${i + 1}` },
    order: i,
    ...overrides,
  }))

export const createMockProject = (overrides: Partial<MockProject> = {}): MockProject => ({
  _id: `project-${Date.now()}-${Math.random()}`,
  title: 'Test Project',
  slug: { current: 'test-project' },
  client: 'Test Client',
  category: 'Film',
  type: 'Feature Film',
  description: 'Test project description',
  featured: false,
  year: 2024,
  mainImage: {
    _type: 'image',
    asset: {
      _ref: 'image-123',
      _type: 'reference'
    }
  },
  ...overrides,
})

export const createMockProjectList = (count = 6, overrides: Partial<MockProject> = {}): MockProject[] =>
  Array.from({ length: count }, (_, i) => createMockProject({
    _id: `project-${i}`,
    title: `Project ${i + 1}`,
    slug: { current: `project-${i + 1}` },
    ...overrides,
  }))

export const createMockTestimonial = (overrides: Partial<MockTestimonial> = {}): MockTestimonial => ({
  _id: `testimonial-${Date.now()}-${Math.random()}`,
  title: 'Great Experience',
  quote: 'Working with DOA was fantastic.',
  author: 'John Doe',
  role: 'Director',
  company: 'Test Productions',
  featured: false,
  ...overrides,
})

export const createMockClient = (overrides: Partial<MockClient> = {}): MockClient => ({
  _id: `client-${Date.now()}-${Math.random()}`,
  name: 'Test Client',
  featured: false,
  ...overrides,
})

export const createMockHomepageSettings = (overrides: Partial<MockHomepageSettings> = {}): MockHomepageSettings => ({
  heroSection: {
    mainTitle: 'Department of Art',
    subtitle: 'DEPARTMENT OF ART',
    showLogo: true,
    ...overrides.heroSection,
  },
  sectionTitles: {
    featuredProjects: 'FEATURED PROJECTS',
    whatWeDo: 'WHAT WE DO',
    ourClients: 'OUR CLIENTS',
    testimonials: 'CLIENT TESTIMONIALS',
    ...overrides.sectionTitles,
  },
  aboutCTA: {
    heading: 'Building Dreams, One Set at a Time',
    description: 'Professional excellence in production design.',
    buttonText: 'Learn More About DOA',
    buttonLink: '/about',
    ...overrides.aboutCTA,
  },
  ...overrides,
})