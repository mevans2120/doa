import { createClient } from 'next-sanity'

// Sanity configuration - hardcoded values as fallback for build process
// Ensure values are strings and properly trimmed
const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vc89ievx').toString().trim()
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').toString().trim()

// Validate project ID format
if (!/^[a-z0-9-]+$/.test(projectId)) {
  console.error('Invalid Sanity project ID format:', projectId)
  // Use hardcoded fallback if env var is invalid
  const fallbackProjectId = 'vc89ievx'
  console.log('Using fallback project ID:', fallbackProjectId)
}

// Log for debugging (will show in Vercel build logs)
if (typeof window === 'undefined') {
  console.log('Sanity config - ProjectId:', projectId, 'Dataset:', dataset)
}

export const client = createClient({
  projectId: projectId === '' || !/^[a-z0-9-]+$/.test(projectId) ? 'vc89ievx' : projectId,
  dataset: dataset === '' ? 'production' : dataset,
  apiVersion: '2024-01-01',
  useCdn: true, // Re-enabled CDN for faster performance
  perspective: 'published',
  token: undefined, // Don't use token for public queries to avoid CORS issues
  stega: {
    enabled: false,
  },
})