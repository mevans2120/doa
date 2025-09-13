import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vc89ievx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Always use CDN for faster performance
  perspective: 'published',
  token: undefined, // Don't use token for public queries to avoid CORS issues
  stega: {
    enabled: false,
  },
})