'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { client } from '../../../sanity/lib/client'
import { portraitImage, urlFor } from '../../../sanity/lib/image'
import { teamMembersQuery, aboutPageQuery } from '../../../sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'
import type { SanityResponsiveImage } from '@/types/sanity'

interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  photo?: SanityResponsiveImage
  imdbUrl?: string
}

interface AboutPageContent {
  title?: string
  tagline?: string
  heroTitle?: string
  companyOverview?: TypedObject[]
  companyImage?: SanityResponsiveImage
  missionTitle?: string
  missionText?: string
  visionTitle?: string
  visionText?: string
  storyTitle?: string
  storyContent?: TypedObject[]
  storyImage?: SanityResponsiveImage
  teamSectionTitle?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pageContent, setPageContent] = useState<AboutPageContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, pageData] = await Promise.all([
          client.fetch<TeamMember[]>(teamMembersQuery),
          client.fetch<AboutPageContent>(aboutPageQuery)
        ])
        setTeamMembers(teamData || [])
        setPageContent(pageData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setTeamMembers([])
        setPageContent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPhotoUrl = (photo: SanityResponsiveImage | undefined) => {
    if (!photo) return null
    try {
      // Use portraitImage for team member photos (4:5 aspect ratio)
      return portraitImage(photo, 400).url()
    } catch {
      return null
    }
  }


  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen text-white bg-black relative">
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        {pageContent && (
          <section className="text-center mb-20 fade-in-up">
            <h1 className="page-title">{pageContent.title}</h1>
            <div className="text-xl heading-font text-gray-300 mb-8">
              {pageContent.tagline}
            </div>
            <div className="professional-divider max-w-md mx-auto"></div>
          </section>
        )}

        {/* Company Overview */}
        {pageContent && (
          <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-font text-3xl font-semibold mb-6">
                {pageContent.heroTitle}
              </h2>
              {pageContent.companyOverview && (
                <div className="text-gray-300 space-y-4 leading-relaxed">
                  <PortableText value={pageContent.companyOverview} />
                </div>
              )}
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden bg-zinc-900">
              {pageContent.companyImage ? (
                <Image
                  src={urlFor(pageContent.companyImage).url()}
                  alt="Department of Art workspace"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <span>Company Image</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Mission & Vision */}
        {pageContent && (
          <section className="mb-20 bg-zinc-900 rounded-lg p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="heading-font text-2xl font-semibold mb-4">
                  {pageContent.missionTitle}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {pageContent.missionText}
                </p>
              </div>
              <div>
                <h3 className="heading-font text-2xl font-semibold mb-4">
                  {pageContent.visionTitle}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {pageContent.visionText}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Our Story Section */}
        {(pageContent?.storyTitle || pageContent?.storyContent) && (
          <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
            {pageContent?.storyImage && (
              <div className="relative h-96 rounded-lg overflow-hidden bg-zinc-900 order-2 md:order-1">
                <Image
                  src={urlFor(pageContent.storyImage).url()}
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="order-1 md:order-2">
              <h2 className="heading-font text-3xl font-semibold mb-6">
                {pageContent?.storyTitle || 'Our Story'}
              </h2>
              {pageContent?.storyContent && (
                <div className="text-gray-300 space-y-4 leading-relaxed">
                  <PortableText value={pageContent.storyContent} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="heading-font text-3xl font-semibold mb-10 text-center">
            {pageContent?.teamSectionTitle || 'Leadership Team'}
          </h2>
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
                          alt={member.photo?.alt || member.name}
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