const AboutCTA = () => {
  return (
    <section className="py-16 px-10 bg-black relative noise-overlay paint-flecks">
      
      {/* CTA Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="bebas-font text-5xl text-white mb-6 text-outline">
          Building Dreams, One Set at a Time
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          With over 15 years of experience in production design, DOA brings creativity, 
          craftsmanship, and reliability to every project.
        </p>
        
        {/* CTA Button */}
        <a href="/about" className="view-all-cta">
          Learn More About DOA
        </a>
      </div>
    </section>
  )
}

export default AboutCTA