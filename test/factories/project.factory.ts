import { faker } from '@faker-js/faker'

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

export const createMockProject = (overrides: Partial<MockProject> = {}): MockProject => ({
  _id: faker.string.uuid(),
  title: faker.company.catchPhrase(),
  slug: { current: faker.helpers.slugify(faker.company.catchPhrase()) },
  client: faker.company.name(),
  category: faker.helpers.arrayElement(['Film', 'Television', 'Commercial', 'Music Video']),
  type: faker.helpers.arrayElement(['Feature Film', 'TV Series', 'Commercial', 'Music Video']),
  mainImage: {
    _type: 'image',
    asset: {
      _ref: faker.string.uuid(),
      _type: 'reference'
    }
  },
  gallery: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    _type: 'image',
    asset: {
      _ref: faker.string.uuid(),
      _type: 'reference'
    },
    _key: faker.string.uuid()
  })),
  description: faker.lorem.paragraph(),
  featured: faker.datatype.boolean(),
  year: faker.date.past({ years: 5 }).getFullYear(),
  credits: {
    director: faker.person.fullName(),
    productionDesigner: faker.person.fullName(),
    cinematographer: faker.person.fullName(),
  },
  technicalDetails: {
    squareFeet: faker.number.int({ min: 1000, max: 50000 }),
    buildDuration: `${faker.number.int({ min: 1, max: 12 })} weeks`,
    specialFeatures: [faker.lorem.words(3), faker.lorem.words(3)],
  },
  ...overrides,
})

export const createMockProjectList = (count = 6, overrides: Partial<MockProject> = {}): MockProject[] => 
  Array.from({ length: count }, () => createMockProject(overrides))