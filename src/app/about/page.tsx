'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { client } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/image'
import { teamMembersQuery } from '../../../sanity/lib/queries'

interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  photo?: { _type: string; asset: { _ref: string; _type: string } }
  imdbUrl?: string
}

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await client.fetch<TeamMember[]>(teamMembersQuery)
        setTeamMembers(data)
      } catch (error) {
        console.error('Error fetching team members:', error)
        setTeamMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  const getPhotoUrl = (photo: { _type: string; asset: { _ref: string; _type: string } } | undefined) => {
    if (!photo) return null
    try {
      return urlFor(photo).width(400).height(400).url()
    } catch {
      return null
    }
  }


  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen text-white bg-black relative noise-overlay">
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="text-center mb-20 fade-in-up">
          <h1 className="page-title">About DOA</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            Department of Art Productions is Portland&apos;s premier production design company,
            transforming creative visions into cinematic reality since 2008.
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </section>

        {/* Company Overview */}
        <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-font text-3xl font-semibold mb-6">Portland&apos;s film & photo beating heart</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Department of Art is a full service scenery shop, supporting the local film/photo community
              for the last 20 years. Set construction, custom prop building, graphics and scenic treatments
              are just some of the services we offer.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              DOA also fabricates retail fixtures, professional trade show displays, and provides services
              for special events and product launches.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The three partners at Department of Art are all 20+ year veterans in the film industry,
              having filled every role from production designer, art director, prop master, decorator,
              lead man, and set dresser. All partners still actively work in the industry thus, DOA can
              be seen as &quot;one stop shopping&quot; for productions seeking all things art department. We can
              provide crew for your shoot, a place for that crew to work, provide internet and office
              needs, gated parking, and trucking for any size production. And when you&apos;re done for
              the day... enjoy a cold beer in our bar and a game of pinball.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden bg-zinc-900">
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
              <span>Company Image</span>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20 bg-zinc-900 rounded-lg p-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="heading-font text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To deliver exceptional production design services that bring creative visions to life,
                while fostering innovation, sustainability, and artistic excellence in everything we do.
              </p>
            </div>
            <div>
              <h3 className="heading-font text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To be the Pacific Northwest&apos;s most trusted production design partner, known for our
                creativity, reliability, and commitment to pushing the boundaries of what&apos;s possible
                in visual storytelling.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="heading-font text-3xl font-semibold mb-10 text-center">Leadership Team</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-zinc-900 animate-pulse" />
                  <div className="h-6 bg-zinc-900 rounded w-32 mx-auto mb-2 animate-pulse" />
                  <div className="h-16 bg-zinc-900 rounded w-48 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {teamMembers.map((member) => {
                const photoUrl = getPhotoUrl(member.photo)
                return (
                  <div key={member._id} className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-zinc-900 relative">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span>No photo</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-1 heading-font">{member.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{member.bio}</p>
                    {member.imdbUrl && (
                      <a
                        href={member.imdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        View on IMDb →
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage