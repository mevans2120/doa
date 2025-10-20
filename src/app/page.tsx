import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import ClientLogos from '@/components/ClientLogos'
import Testimonials from '@/components/Testimonials'
import AboutCTA from '@/components/AboutCTA'
import Footer from '@/components/Footer'
import { client } from '../../sanity/lib/client'
import {
  homepageSettingsQuery,
  featuredProjectsQuery,
  servicesQuery,
  featuredClientsQuery,
  featuredTestimonialsQuery,
} from '../../sanity/lib/queries'
import { toPlainText } from '@portabletext/toolkit'
import type { TypedObject } from '@portabletext/types'

interface Service {
  _id: string
  title: string
  shortDescription: string
  iconType?: string
  featured?: boolean
  order: number
}

// Revalidate every 5 minutes as fallback (webhooks will trigger instant updates)
export const revalidate = 300

export default async function Home() {
  // Fetch all data in parallel on the server
  const [homepageSettings, projects, services, clients, testimonials] = await Promise.all([
    client.fetch(homepageSettingsQuery),
    client.fetch(featuredProjectsQuery),
    client.fetch<Service[]>(servicesQuery),
    client.fetch(featuredClientsQuery),
    client.fetch(featuredTestimonialsQuery),
  ])

  // Helper function to convert Portable Text to plain string
  const toPlainString = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (Array.isArray(value)) {
      try {
        return toPlainText(value as TypedObject[])
      } catch {
        return ''
      }
    }
    return ''
  }

  // Prepare fallback data with safe defaults and convert Portable Text
  const safeProjects = (projects || []).map((project: typeof projects[0]) => ({
    ...project,
    description: toPlainString(project.description)
  }))
  const safeServices = services || []
  const safeClients = clients?.slice(0, 6) || []
  const safeTestimonials = (testimonials || []).slice(0, 4).map((testimonial: typeof testimonials[0]) => ({
    ...testimonial,
    quote: toPlainString(testimonial.quote)
  }))

  // Convert Portable Text fields to plain strings
  const safeHeroSettings = homepageSettings ? {
    heroSection: homepageSettings.heroSection ? {
      showLogo: homepageSettings.heroSection.showLogo,
      subtitle: toPlainString(homepageSettings.heroSection.subtitle)
    } : undefined
  } : undefined

  const safeAboutCTA = homepageSettings?.aboutCTA ? {
    heading: toPlainString(homepageSettings.aboutCTA.heading),
    description: toPlainString(homepageSettings.aboutCTA.description),
    buttonText: toPlainString(homepageSettings.aboutCTA.buttonText),
    buttonLink: homepageSettings.aboutCTA.buttonLink || '/about'
  } : undefined

  return (
    <div className="min-h-screen">
      <Header />
      <Hero settings={safeHeroSettings} />
      <Projects
        projects={safeProjects}
        sectionTitle={toPlainString(homepageSettings?.sectionTitles?.featuredProjects) || 'OUR WORK'}
      />
      <Services
        services={safeServices.filter((s) => s.featured === true).slice(0, 4)}
        sectionTitle={toPlainString(homepageSettings?.sectionTitles?.whatWeDo) || 'WHAT WE DO'}
        limit={4}
      />
      <ClientLogos
        clients={safeClients}
        sectionTitle={toPlainString(homepageSettings?.sectionTitles?.ourClients) || 'OUR CLIENTS'}
      />
      <Testimonials
        testimonials={safeTestimonials}
        sectionTitle={toPlainString(homepageSettings?.sectionTitles?.testimonials) || 'TESTIMONIALS'}
      />
      <AboutCTA settings={safeAboutCTA} />
      <Footer />
    </div>
  )
}
