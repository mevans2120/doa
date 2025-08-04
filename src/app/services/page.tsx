import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ServicesPage = () => {
  const services = [
    {
      id: 'set-design',
      title: 'Set Design & Construction',
      description: 'From concept to completion, we design and build immersive sets that bring your creative vision to life. Our team specializes in creating detailed, functional environments for any scale of production.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'production-design',
      title: 'Production Design',
      description: 'Comprehensive production design services that establish the visual language of your project. We work closely with directors and cinematographers to create cohesive, story-driven environments.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      id: 'art-direction',
      title: 'Art Direction',
      description: 'Creative art direction that ensures every visual element supports your narrative. Our art directors bring expertise in color theory, composition, and visual storytelling to elevate your production.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      )
    },
    {
      id: 'custom-fabrication',
      title: 'Custom Fabrication',
      description: 'Specialized fabrication services for unique props, set pieces, and architectural elements. Our workshop can create anything from period-accurate furniture to futuristic technology.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 3.95-.843 1.704-1.854 3.592-2.814 5.192" />
        </svg>
      )
    },
    {
      id: 'location-scouting',
      title: 'Location Scouting',
      description: 'Expert location scouting throughout the Pacific Northwest. We find and secure the perfect locations for your production, handling all logistics and permit requirements.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'props-dressing',
      title: 'Props & Set Dressing',
      description: 'Comprehensive prop rental and set dressing services. Our extensive inventory and network of suppliers ensure authentic, period-appropriate details for any production.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'vfx-integration',
      title: 'Visual Effects Integration',
      description: 'Seamless integration of practical sets with visual effects. We design and build with post-production in mind, including green screen environments and tracking marker systems.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'event-design',
      title: 'Event Design',
      description: 'Spectacular event design for corporate functions, fashion shows, and live performances. We create memorable experiences with innovative staging and environmental design.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'consultation',
      title: 'Consultation Services',
      description: 'Professional consultation for productions at any stage. From budgeting and scheduling to technical problem-solving, our expertise helps streamline your production process.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800 -z-10"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 display-font">Our Services</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From initial concept to final construction, DOA provides comprehensive production design services 
            for film, television, commercials, and live events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-zinc-900 rounded-lg p-8 hover:bg-zinc-800 transition-colors duration-300"
            >
              <div className="text-white mb-6">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to bring your vision to life?</h2>
          <a
            href="/contact"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
          >
            Get in Touch
          </a>
        </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage