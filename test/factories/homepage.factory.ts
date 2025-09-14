import { faker } from '@faker-js/faker'

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
    aboutCTA?: string
  }
  aboutCTA?: {
    heading?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { _type: string; asset: { _ref: string; _type: string } }
  }
}

export const createMockHomepageSettings = (overrides: Partial<MockHomepageSettings> = {}): MockHomepageSettings => ({
  heroSection: {
    mainTitle: faker.company.catchPhrase(),
    subtitle: 'DEPARTMENT OF ART',
    showLogo: true,
    ...overrides.heroSection,
  },
  sectionTitles: {
    featuredProjects: 'FEATURED PROJECTS',
    whatWeDo: 'WHAT WE DO',
    ourClients: 'OUR CLIENTS',
    testimonials: 'CLIENT TESTIMONIALS',
    aboutCTA: 'Ready to Create Something Extraordinary?',
    ...overrides.sectionTitles,
  },
  aboutCTA: {
    heading: 'Building Dreams, One Set at a Time',
    description: faker.lorem.paragraph(),
    buttonText: 'Learn More About DOA',
    buttonLink: '/about',
    ...overrides.aboutCTA,
  },
  seo: {
    metaTitle: faker.company.name() + ' | ' + faker.company.catchPhrase(),
    metaDescription: faker.lorem.paragraph(),
    ogImage: {
      _type: 'image',
      asset: {
        _ref: faker.string.uuid(),
        _type: 'reference'
      }
    },
    ...overrides.seo,
  },
})