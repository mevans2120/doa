import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Services from '@/components/Services'
import { client } from '../../../sanity/lib/client'
import { servicesPageQuery, servicesQuery } from '../../../sanity/lib/queries'
import type { Metadata } from 'next'

// Revalidate every 5 minutes as fallback (webhooks will trigger instant updates)
export const revalidate = 300

interface ServicesPageData {
  pageTitle?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getServicesPageData() {
  try {
    const pageData = await client.fetch<ServicesPageData>(servicesPageQuery)
    const services = await client.fetch(servicesQuery)
    return { pageData: pageData || {}, services }
  } catch (error) {
    console.error('Error fetching services page data:', error)
    return { pageData: {}, services: [] }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { pageData } = await getServicesPageData()

  return {
    title: pageData?.seo?.metaTitle || 'Services | Department of Art',
    description: pageData?.seo?.metaDescription || 'Explore our comprehensive production services including set construction, scenic painting, prop fabrication, and more.',
  }
}

const ServicesPage = async () => {
  const { pageData, services } = await getServicesPageData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Services
          pageData={pageData}
          services={services}
        />
      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage