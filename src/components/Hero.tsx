import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
  return (
    <section role="banner" className="relative h-[700px] bg-[#252525] flex items-center px-10 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Skull SVG as featured element */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-96 h-[500px] z-10 opacity-30">
        <Image
          src="/skull.svg"
          alt="Skull"
          width={384}
          height={500}
          className="filter brightness-0 invert opacity-50"
          style={{ filter: 'invert(75%) sepia(10%) saturate(200%) hue-rotate(180deg) brightness(95%) contrast(80%)' }}
        />
      </div>
      
      {/* Hero content */}
      <div className="relative z-20 text-white max-w-4xl">
        <div className="relative z-20 fade-in-up">
          {/* Main headline */}
          <h1 className="text-9xl font-normal mb-8 leading-tight display-font text-white">
            <span className="block">Department of Art</span>
          </h1>
     
          
          {/* Professional description */}
          <div className="mb-12 body-font text-lg text-gray-300 leading-relaxed max-w-2xl">
            <p>
              We bring creative visions to life through expert craftsmanship and innovative design.
              From concept to completion, our team delivers exceptional set construction services
              for the entertainment industry.
            </p>
          </div>
          
          {/* Professional CTA buttons */}
          <div className="flex gap-6">
            <Link
              href="#contact"
              className="professional-btn text-lg"
            >
              Get in Touch
            </Link>
            
   
          </div>
    
        </div>
      </div>
      
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-doa-gold to-transparent"></div>
    </section>
  )
}

export default Hero