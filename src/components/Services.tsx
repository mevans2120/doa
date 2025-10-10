'use client'

import { useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { useHomepage } from '@/contexts/HomepageContext'
import { ServiceIcons } from './ServiceIcons'
import ViewfinderCorners from './ViewfinderCorners'
import type { TypedObject } from '@portabletext/types'
import RichText from './RichText'

interface ServicesProps {
  limit?: number;
  pageData?: {
    pageTitle?: string;
  };
  services?: Service[];
}

interface Service {
  _id: string;
  title: string;
  slug?: { current: string };
  shortDescription: TypedObject | TypedObject[];
  iconType?: string;
  category?: string;
  order: number;
  featured?: boolean;
}

const Services = ({ limit, pageData, services: propServices }: ServicesProps = {}) => {
  const { settings } = useHomepage()
  const sectionTitle = pageData?.pageTitle || settings.sectionTitles?.whatWeDo || ''

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If services are passed as props, use them directly
    if (propServices) {
      setServices(propServices)
      setLoading(false)
      return
    }

    // Otherwise fetch them
    const fetchServices = async () => {
      try {
        const query = limit
          ? `*[_type == "service" && featured == true] | order(order asc) [0...${limit}]`
          : '*[_type == "service"] | order(order asc)'

        const data = await client.fetch<Service[]>(query)
        setServices(data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
        // Fallback to empty array if fetch fails
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [limit, propServices])

  const getIcon = (iconType: string | undefined) => {
    if (!iconType || !ServiceIcons[iconType]) {
      return ServiceIcons['tools'] // Default icon
    }
    return ServiceIcons[iconType]
  }

  if (loading) {
    return (
      <section className="pt-32 pb-24 px-10 bg-black relative overflow-hidden paint-flecks " id="services" role="region">
        <div className="relative z-10 text-center mb-8">
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg p-8 h-48 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className="pt-32 pb-24 px-10 bg-black relative overflow-hidden paint-flecks " id="services" role="region">
        <div className="relative z-10 text-center mb-8">
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
        </div>
        <p className="text-gray-400 text-center">No services available at the moment.</p>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-24 px-10 bg-black relative overflow-hidden paint-flecks " id="services" role="region">

      {/* Viewfinder corners - top left, bottom right */}
      <ViewfinderCorners pattern="left-right" />

      {/* Section title */}
      <div className="relative z-10 text-center mb-8 fade-in-up">
        <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
          {sectionTitle}
        </h2>
      </div>
      
      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-zinc-900 rounded-lg p-8"
          >
            {/* Service icon */}
            <div className="text-white mb-6">
              {getIcon(service.iconType)}
            </div>
            
            {/* Service title */}
            <h3 className="heading-font text-2xl font-semibold mb-4 text-white text-left">
              {service.title}
            </h3>

            {/* Service description */}
            <div className="text-left">
              <RichText value={service.shortDescription} />
            </div>
            
          </div>
        ))}
      </div>

      {/* View All CTA - Only show when there's a limit and more services exist */}
      {limit && services.length >= limit && (
        <div className="text-center mt-16 relative z-10">
          <a href="/services" className="view-all-cta">
            View All Services
          </a>
        </div>
      )}

    </section>
  )
}

export default Services