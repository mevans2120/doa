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

      {/* Sine wave bottom accent - same as Hero */}
      <svg className="absolute -bottom-10 left-0 right-0 w-full h-32 overflow-visible z-50" preserveAspectRatio="none" viewBox="0 0 1200 160">
        <defs>
          <linearGradient id="waveGradientBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#c0c0c0" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#c0c0c0" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#c0c0c0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        
        {/* Layer 1 - Thinnest stroke for edges */}
        <path 
          d="M 0,80 
             L 400,80
             L 500,80
             L 520,78
             L 540,82
             L 560,75
             L 570,85
             L 580,70
             L 590,90
             L 595,60
             L 598,30
             L 600,-20
             L 602,180
             L 604,140
             L 607,90
             L 610,85
             L 620,70
             L 630,90
             L 640,75
             L 650,85
             L 670,82
             L 690,78
             L 710,80
             L 800,80
             L 1200,80" 
          fill="none" 
          stroke="url(#waveGradientBottom)" 
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Layer 2 - Medium stroke */}
        <path 
          d="M 300,80
             L 400,80
             L 500,80
             L 520,78
             L 540,82
             L 560,75
             L 570,85
             L 580,70
             L 590,90
             L 595,60
             L 598,30
             L 600,-20
             L 602,180
             L 604,140
             L 607,90
             L 610,85
             L 620,70
             L 630,90
             L 640,75
             L 650,85
             L 670,82
             L 690,78
             L 710,80
             L 800,80
             L 900,80" 
          fill="none" 
          stroke="url(#waveGradientBottom)" 
          strokeWidth="1"
          opacity="0.7"
        />
        
        {/* Layer 3 - Thicker stroke */}
        <path 
          d="M 400,80
             L 500,80
             L 520,78
             L 540,82
             L 560,75
             L 570,85
             L 580,70
             L 590,90
             L 595,60
             L 598,30
             L 600,-20
             L 602,180
             L 604,140
             L 607,90
             L 610,85
             L 620,70
             L 630,90
             L 640,75
             L 650,85
             L 670,82
             L 690,78
             L 710,80
             L 800,80" 
          fill="none" 
          stroke="url(#waveGradientBottom)" 
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Layer 4 - Thickest stroke for center */}
        <path 
          d="M 500,80
             L 520,78
             L 540,82
             L 560,75
             L 570,85
             L 580,70
             L 590,90
             L 595,60
             L 598,30
             L 600,-20
             L 602,180
             L 604,140
             L 607,90
             L 610,85
             L 620,70
             L 630,90
             L 640,75
             L 650,85
             L 670,82
             L 690,78
             L 710,80" 
          fill="none" 
          stroke="#c0c0c0" 
          strokeWidth="3"
          opacity="0.5"
        />
      </svg>
    </section>
  )
}

export default AboutCTA