/**
 * Real data fixtures from Sanity CMS
 * These are actual data snapshots used for testing
 */

import realServices from './real-services.json'
import realProjects from './real-projects.json'
import realClients from './real-clients.json'
import realTestimonials from './real-testimonials.json'
import realHomepageSettings from './real-homepage-settings.json'

// Export the real data for use in tests
export const fixtures = {
  services: realServices,
  projects: realProjects,
  clients: realClients,
  testimonials: realTestimonials,
  homepageSettings: realHomepageSettings,
}

// Helper to get specific fixture data
export const getFixture = (type: keyof typeof fixtures) => {
  return fixtures[type]
}

// Get first N items from a fixture
export const getFixtureItems = (type: keyof typeof fixtures, count: number) => {
  const data = fixtures[type]
  if (Array.isArray(data)) {
    return data.slice(0, count)
  }
  return data
}