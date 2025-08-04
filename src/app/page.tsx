import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import ClientLogos from '@/components/ClientLogos'
import Testimonials from '@/components/Testimonials'
import AboutCTA from '@/components/AboutCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Projects />
      <Services />
      <ClientLogos />
      <Testimonials />
      <AboutCTA />
      <Footer />
    </div>
  )
}
