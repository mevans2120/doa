'use client'

import { useHomepage } from '@/contexts/HomepageContext'

const AboutCTA = () => {
  const { settings } = useHomepage()
  
  const heading = settings.aboutCTA?.heading || 'Building Dreams, One Set at a Time'
  const description = settings.aboutCTA?.description || 'With over 15 years of experience in production design, DOA brings creativity, craftsmanship, and reliability to every project.'
  const buttonText = settings.aboutCTA?.buttonText || 'Learn More About DOA'
  const buttonLink = settings.aboutCTA?.buttonLink || '/about'
  
  return (
    <section className="py-16 px-10 bg-black relative noise-overlay paint-flecks">
      
      {/* CTA Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="bebas-font text-5xl text-white mb-6 text-outline">
          {heading}
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* CTA Button */}
        <a href={buttonLink} className="view-all-cta">
          {buttonText}
        </a>
      </div>
    </section>
  )
}

export default AboutCTA