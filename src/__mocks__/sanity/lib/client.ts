/* eslint-disable @typescript-eslint/no-explicit-any */
import { fixtures } from '../../../../test/fixtures'

// Mock Sanity client that returns real fixture data
const mockClient = {
  fetch: jest.fn((query: string) => {
    // Parse the query to determine what data to return
    if (query.includes('_type == "service"')) {
      if (query.includes('featured == true')) {
        // Return featured services
        return Promise.resolve(fixtures.services.filter((s: any) => s.featured))
      }
      return Promise.resolve(fixtures.services)
    }
    if (query.includes('_type == "project"')) {
      if (query.includes('featured == true')) {
        return Promise.resolve(fixtures.projects.filter((p: any) => p.featured))
      }
      return Promise.resolve(fixtures.projects)
    }
    if (query.includes('_type == "client"')) {
      if (query.includes('featured == true')) {
        return Promise.resolve(fixtures.clients.filter((c: any) => c.featured))
      }
      return Promise.resolve(fixtures.clients)
    }
    if (query.includes('_type == "testimonial"')) {
      if (query.includes('featured == true')) {
        return Promise.resolve(fixtures.testimonials.filter((t: any) => t.featured))
      }
      return Promise.resolve(fixtures.testimonials)
    }
    if (query.includes('_type == "homepageSettings"')) {
      return Promise.resolve(fixtures.homepageSettings)
    }
    // Default empty array
    return Promise.resolve([])
  }),
  create: jest.fn(),
  createOrReplace: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    unset: jest.fn().mockReturnThis(),
    commit: jest.fn(),
  })),
  transaction: jest.fn(() => ({
    create: jest.fn().mockReturnThis(),
    patch: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    commit: jest.fn(),
  })),
}

export const client = mockClient

export const createClient = jest.fn(() => mockClient)