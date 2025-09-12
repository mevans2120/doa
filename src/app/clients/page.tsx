'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/image'
import { clientsQuery } from '../../../sanity/lib/queries'

interface ClientData {
  _id: string
  name: string
  logo?: { _type: string; asset: { _ref: string; _type: string } }
  logoWhite?: { _type: string; asset: { _ref: string; _type: string } }
  website?: string
  featured?: boolean
}

const ClientsPage = () => {
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await client.fetch<ClientData[]>(clientsQuery)
        setClients(data)
      } catch (error) {
        console.error('Error fetching clients:', error)
        setClients([])
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const collaborators = [
    'HAPPYLUCKY INC',
    'ANONYMOUS CONTENT',
    'R2C GROUP',
    'WEIDEN AND KENNEDY',
    'C.M.D.',
    'BOB INDUSTRIES',
    'HOUSE SPECIAL',
    'CB&S',
    'MJZ',
    'FARM LEAGUE',
    'KAMP GRIZZLY',
    'UBER CONTENT',
    'R/WEST',
    'SOCKEYE',
    'REVERY',
    'NORTH',
    'AFTER ALL',
    'FOODCHAIN FILMS'
  ]

  const getLogoUrl = (logo: { _type: string; asset: { _ref: string; _type: string } } | undefined) => {
    if (!logo) return null
    try {
      return urlFor(logo).width(280).height(120).url()
    } catch {
      return null
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="relative min-h-screen text-white noise-overlay">
          <div className="fixed inset-0 bg-black -z-10"></div>
          <div className="relative z-10 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-16">
                <h1 className="page-title">Our Clients</h1>
                <div className="text-xl heading-font text-gray-300 mb-8">Loading clients...</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-900 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white noise-overlay">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-black -z-10"></div>
        
        <div className="relative z-10 pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-16 fade-in-up">
          <h1 className="page-title">Our Clients</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            Trusted by Leading Brands and Production Companies
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        {/* Client Logos */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {clients.map((client) => {
              const logoUrl = getLogoUrl(client.logoWhite || client.logo)
              if (!logoUrl) return null
              
              return (
                <div
                  key={client._id}
                  className="flex items-center justify-center"
                >
                  {client.website ? (
                    <a 
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Image
                        src={logoUrl}
                        alt={`${client.name} logo`}
                        width={140}
                        height={60}
                        className="object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </a>
                  ) : (
                    <Image
                      src={logoUrl}
                      alt={`${client.name} logo`}
                      width={140}
                      height={60}
                      className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Featured Collaborators */}
        <section className="mb-20">
          <h2 className="section-title">Featured Collaborators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {collaborators.map((collaborator, index) => (
              <div
                key={index}
                className="text-center"
              >
                <h3 className="text-lg font-semibold heading-font text-white hover:opacity-80 transition-opacity">{collaborator}</h3>
              </div>
            ))}
          </div>
        </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ClientsPage