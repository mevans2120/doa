interface AboutCTAProps {
  settings?: {
    heading?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
}

const AboutCTA = ({ settings }: AboutCTAProps) => {
  const heading = settings?.heading || ''
  const description = settings?.description || ''
  const buttonText = settings?.buttonText || ''
  const buttonLink = settings?.buttonLink || '/about'

  return (
    <section className="py-16 px-10 bg-black relative paint-flecks">

      {/* CTA Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="bebas-font text-4xl sm:text-5xl md:text-6xl text-white mb-6 text-outline">
          {heading}
        </h2>
        {description && (
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {description}
          </p>
        )}

        {/* CTA Button */}
        <a href={buttonLink} className="view-all-cta">
          {buttonText}
        </a>
      </div>
    </section>
  )
}

export default AboutCTA