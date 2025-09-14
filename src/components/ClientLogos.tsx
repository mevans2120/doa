'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'
import { featuredClientsQuery } from '../../sanity/lib/queries'
import { useHomepage } from '@/contexts/HomepageContext'

interface Client {
  _id: string;
  name: string;
  logo?: { _type: string; asset: { _ref: string; _type: string } };
  logoWhite?: { _type: string; asset: { _ref: string; _type: string } };
}

const ClientLogos = () => {
  const { settings } = useHomepage()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  
  const sectionTitle = settings.sectionTitles?.ourClients || 'OUR CLIENTS'

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await client.fetch<Client[]>(featuredClientsQuery)
        if (data && Array.isArray(data)) {
          setClients(data.slice(0, 6)) // Show only first 6 clients
        } else {
          throw new Error('Invalid data format')
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
        // Fallback to hardcoded clients if Sanity fetch fails
        setClients([
          { _id: '1', name: 'Netflix' },
          { _id: '2', name: 'Microsoft' },
          { _id: '3', name: 'Nike' },
          { _id: '4', name: 'Intel' },
          { _id: '5', name: 'Amazon Studios' },
          { _id: '6', name: 'Columbia Sportswear' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const getLogoUrl = (client: Client) => {
    // Use white logo if available (for dark backgrounds), otherwise use regular logo
    const logo = client.logoWhite || client.logo
    if (!logo) {
      // Return placeholder or use existing SVG logos as fallback
      const logoMap: { [key: string]: string } = {
        'Netflix': '/Netflix_2015_logo.svg',
        'Microsoft': '/Microsoft_logo_(2012).svg',
        'Nike': '/Logo_NIKE.svg',
        'Intel': '/Intel_logo_(2020,_light_blue).svg',
        'Amazon Studios': '/Amazon_logo.svg',
        'Columbia Sportswear': '/Columbia_Sportswear_Co_logo.svg',
      }
      return logoMap[client.name] || '/placeholder-logo.svg'
    }
    
    try {
      return urlFor(logo).width(280).height(140).url()
    } catch {
      return '/placeholder-logo.svg'
    }
  }

  if (loading) {
    return (
      <section className="py-24 px-10 bg-black relative overflow-hidden noise-overlay paint-flecks" id="clients">
        <div className="relative z-10 text-center mb-20">
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto relative z-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-10 bg-black relative overflow-hidden noise-overlay paint-flecks" id="clients">
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
          {sectionTitle}
        </h2>
      </div>
      
      {/* Client grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto relative z-10">
        {clients.map((client) => (
          <div
            key={client._id}
            className="flex items-center justify-center"
          >
            <Image
              src={getLogoUrl(client)}
              alt={`${client.name} logo`}
              width={140}
              height={70}
              className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>
      
      {/* View All CTA */}
      <div className="text-center mt-16 relative z-10">
        <a href="/our-clients" className="view-all-cta">
          View All Clients
        </a>
      </div>

    </section>
  )
}

export default ClientLogos