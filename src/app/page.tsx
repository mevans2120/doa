import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import ClientLogos from '@/components/ClientLogos'
import Testimonials from '@/components/Testimonials'
import AboutCTA from '@/components/AboutCTA'
import Footer from '@/components/Footer'
import { HomepageProvider } from '@/contexts/HomepageContext'

export default function Home() {
  return (
    <HomepageProvider>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <Projects />
        <Services limit={4} />
        <ClientLogos />
        <Testimonials />
        <AboutCTA />
        <Footer />
      </div>
    </HomepageProvider>
  )
}
