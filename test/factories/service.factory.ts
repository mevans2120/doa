import { faker } from '@faker-js/faker'

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

export const createMockService = (overrides: Partial<MockService> = {}): MockService => ({
  _id: faker.string.uuid(),
  title: faker.company.buzzPhrase(),
  slug: { current: faker.helpers.slugify(faker.company.buzzPhrase()) },
  shortDescription: faker.lorem.sentence(),
  iconType: faker.helpers.arrayElement(['tools', 'building', 'brush', 'paint', 'display', 'cart', 'box', 'truck', 'users', 'warehouse', 'globe', 'lightning']),
  category: faker.helpers.arrayElement(['production', 'design', 'fabrication', 'rentals', 'specialty']),
  order: faker.number.int({ min: 0, max: 20 }),
  featured: faker.datatype.boolean(),
  ...overrides,
})

export const createMockServiceList = (count = 5, overrides: Partial<MockService> = {}): MockService[] => 
  Array.from({ length: count }, () => createMockService(overrides))