const Services = () => {
  const services = [
    {
      title: "Set Construction",
      description: "Expert craftsmanship in building custom sets for film, television, and commercial productions with attention to detail and structural integrity."
    },
    {
      title: "Prop Building",
      description: "Custom fabrication of props and set pieces using traditional and modern techniques to achieve authentic, camera-ready results."
    },
    {
      title: "Production Services",
      description: "Comprehensive support throughout the production process, from pre-production planning to on-set assistance and strike."
    }
  ]

  return (
    <section className="py-24 px-10 bg-[#252525] relative overflow-hidden" id="services" role="region">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="text-5xl font-bold heading-font text-white mb-6">
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
            className="professional-card p-8 text-center transform transition-all duration-300 hover:scale-105 relative overflow-hidden group rounded-lg"
          >
            {/* Service icon placeholder */}
            <div className="w-16 h-16 mx-auto mb-6 image-wireframe rounded-full flex items-center justify-center">
              <span className="text-xs">Icon</span>
            </div>
            
            {/* Service title */}
            <h3 className="text-xl heading-font text-white font-semibold mb-4">
              {service.title}
            </h3>
            
            {/* Service description */}
            <p className="text-gray-300 body-font leading-relaxed">
              {service.description}
            </p>
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-doa-gold"></div>
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