'use client'

import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fonts } from '@/lib/fonts'

const ClientsPage = () => {

  const clientLogos = [
    { name: 'Netflix', logo: '/Netflix_2015_logo.svg' },
    { name: 'Amazon Studios', logo: '/Amazon_logo.svg' },
    { name: 'Microsoft Studios', logo: '/Microsoft_logo_(2012).svg' },
    { name: 'Meta Productions', logo: '/Meta_Platforms_Inc._logo.svg' },
    { name: 'Nike Films', logo: '/Logo_NIKE.svg' },
    { name: 'Adidas Media', logo: '/Adidas_Logo.svg' },
    { name: 'Intel Studios', logo: '/Intel_logo_(2020,_light_blue).svg' },
    { name: 'Columbia Pictures', logo: '/Columbia_Sportswear_Co_logo.svg' },
    { name: 'Spotify Originals', logo: '/Black_Spotify_logo_with_text.svg' },
    { name: 'Nintendo Pictures', logo: '/Nintendo_logo.svg' },
    { name: 'Keen Productions', logo: '/keen-1.svg' },
    { name: 'JELD-WEN Media', logo: '/JELD-WEN-logo.svg' }
  ]

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


  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800 -z-10"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-16 fade-in-up">
          <h1 className={`${fonts.display} text-5xl font-bold text-white mb-6`}>Our Clients</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            Trusted by Leading Brands and Production Companies
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        {/* Client Logos */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="bg-zinc-900 rounded-lg p-8 flex items-center justify-center hover:bg-zinc-800 transition-colors duration-300"
              >
                <div className="text-gray-400 text-center w-full">
                  <div className="h-16 flex items-center justify-center mb-2 relative">
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={140}
                      height={60}
                      className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Collaborators */}
        <section className="mb-20">
          <h2 className={`${fonts.display} text-3xl font-semibold mb-10 text-center`}>Featured Collaborators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collaborators.map((collaborator, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-center heading-font">{collaborator}</h3>
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