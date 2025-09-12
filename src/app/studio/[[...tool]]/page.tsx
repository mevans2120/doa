/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js App Router catch-all routes:
 * https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client'

import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

// Dynamically import the Studio with no SSR to avoid hydration issues
const NextStudio = dynamic(
  () => import('next-sanity/studio').then(mod => mod.NextStudio),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#f3f3f3'
      }}>
        <div>Loading Studio...</div>
      </div>
    )
  }
)

export default function StudioPage() {
  return (
    <div style={{ height: '100vh' }}>
      <NextStudio config={config} />
    </div>
  )
}