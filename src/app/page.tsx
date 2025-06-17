import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import ClientLogos from '@/components/ClientLogos'
import Testimonials from '@/components/Testimonials'
import ContactCTA from '@/components/ContactCTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Projects />
      <ClientLogos />
      <Testimonials />
      <ContactCTA />
    </div>
  )
}
