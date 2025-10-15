import { createClient } from 'next-sanity'

// Sanity configuration - requires environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Validate required configuration
if (!projectId) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')
}

// Validate project ID format
if (!/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(`Invalid Sanity project ID format: ${projectId}`)
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true, // Enable CDN for better performance
  perspective: 'published',
  token: undefined, // Don't use token for public queries to avoid CORS issues
  stega: {
    enabled: false,
  },
})