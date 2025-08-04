const Services = () => {
  const services = [
    {
      id: 'set-design',
      title: 'Set Design & Construction',
      description: 'From concept to completion, we design and build immersive sets that bring your creative vision to life.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'custom-fabrication',
      title: 'Custom Fabrication',
      description: 'Specialized fabrication services for unique props, set pieces, and architectural elements.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 3.95-.843 1.704-1.854 3.592-2.814 5.192" />
        </svg>
      )
    },
    {
      id: 'production-design',
      title: 'Production Design',
      description: 'Comprehensive production design services that establish the visual language of your project.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    }
  ]

  return (
    <section className="py-24 px-10 bg-[#252525] relative overflow-hidden" id="services" role="region">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="text-5xl font-bold text-white mb-6 display-font">
          Our Services
        </h2>
        <div className="text-xl heading-font text-gray-300 mb-8">
          Comprehensive Set Construction & Design Solutions
        </div>
        <div className="professional-divider max-w-md mx-auto"></div>
      </div>
      
      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-lg p-8 hover:bg-zinc-800 transition-all duration-300"
          >
            {/* Service icon */}
            <div className="text-white mb-6">
              {service.icon}
            </div>
            
            {/* Service title */}
            <h3 className="text-2xl font-semibold mb-4 text-white text-left">
              {service.title}
            </h3>
            
            {/* Service description */}
            <p className="text-gray-400 leading-relaxed text-left">
              {service.description}
            </p>
            
          </div>
        ))}
      </div>

      {/* View All CTA */}
      <div className="text-center mt-16 relative z-10">
        <a href="/services" className="view-all-cta">
          View All Services
        </a>
      </div>

    </section>
  )
}

export default Services