import { fonts } from '../lib/fonts'

const AboutCTA = () => {
  return (
    <section className="py-16 px-10 bg-[#252525] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* CTA Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 className={`${fonts.display} text-4xl font-bold text-white mb-6`}>
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