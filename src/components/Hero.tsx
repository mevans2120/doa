interface HeroProps {
  settings?: {
    heroSection?: {
      showLogo?: boolean
      subtitle?: string
    }
  }
}

const Hero = ({ settings }: HeroProps) => {
  const showLogo = settings?.heroSection?.showLogo !== false
  const subtitle = settings?.heroSection?.subtitle || ''

  return (
    <section role="banner" className="relative h-[90vh] lg:h-[100vh] bg-[#252525] flex items-center justify-center px-6 md:px-10 overflow-visible">
      {/* Animated background gradient - moves opposite to navigation for complementary effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#710000] via-[#252525] to-black bg-[length:200%_200%] animate-gradient-x-reverse"
        style={{ willChange: 'background-position' }}
      ></div>

      
      {/* Hero content - Centered */}
      <div className="relative z-20 text-white text-center lg:mt-[125px]">
        <div className="relative z-20">
          {/* DOA Logo - Now the hero element */}
          {showLogo && (
            <div className="mb-0 flex justify-center opacity-0 animate-hero-fade-in" style={{ willChange: 'opacity, transform' }}>
              <picture>
                {/* WebP sources for modern browsers */}
                <source
                  media="(max-width: 640px)"
                  srcSet="/doa-logo-400.webp 1x, /doa-logo-800.webp 2x"
                  type="image/webp"
                />
                <source
                  media="(max-width: 1024px)"
                  srcSet="/doa-logo-800.webp 1x, /doa-logo-1400.webp 2x"
                  type="image/webp"
                />
                <source
                  srcSet="/doa-logo-1400.webp 1x"
                  type="image/webp"
                />

                {/* PNG fallback sources */}
                <source
                  media="(max-width: 640px)"
                  srcSet="/doa-logo-400.png 1x, /doa-logo-800.png 2x"
                  type="image/png"
                />
                <source
                  media="(max-width: 1024px)"
                  srcSet="/doa-logo-800.png 1x, /doa-logo-1400.png 2x"
                  type="image/png"
                />

                {/* Final fallback img */}
                <img
                  src="/doa-logo-800.png"
                  alt="Department of Art Logo"
                  width="1400"
                  height="570"
                  className="brightness-0 invert w-[340px] sm:w-[440px] md:w-[560px] lg:w-[680px] h-auto"
                  fetchPriority="high"
                />
              </picture>
            </div>
          )}

          {/* Department of Art text below logo - Curved */}
          <div className="-mt-[53px] md:mt-0 lg:-mt-[50px] opacity-0 animate-hero-fade-in-delay-1" style={{ willChange: 'opacity, transform' }}>
            {/* Mobile/Small - larger font */}
            <svg viewBox="0 0 900 150" className="block md:hidden w-full max-w-6xl mx-auto h-[220px] sm:h-[280px]">
              <defs>
                <path id="curve-mobile" d="M 50,100 Q 450,20 850,100" />
              </defs>
              <text className="bebas-font uppercase tracking-wider" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fontSize="120">
                <textPath href="#curve-mobile" startOffset="50%" textAnchor="middle">
                  {subtitle}
                </textPath>
              </text>
            </svg>
            {/* Medium/Large - original font */}
            <svg viewBox="0 0 900 150" className="hidden md:block w-full max-w-6xl mx-auto md:h-[340px] lg:h-[400px]">
              <defs>
                <path id="curve-desktop" d="M 50,100 Q 450,20 850,100" />
              </defs>
              <text className="bebas-font uppercase tracking-wider" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fontSize="90">
                <textPath href="#curve-desktop" startOffset="50%" textAnchor="middle">
                  {subtitle}
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Sine wave bottom accent */}
      <svg className="absolute -bottom-10 left-0 right-0 w-full h-32 overflow-visible z-50 opacity-0 animate-hero-fade-in-delay-2" style={{ willChange: 'opacity, transform' }} preserveAspectRatio="none" viewBox="0 0 1200 160">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#c0c0c0" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#c0c0c0" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#c0c0c0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <mask id="strokeMask">
            <rect x="0" y="0" width="1200" height="160" fill="white"/>
          </mask>
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
          stroke="url(#waveGradient)" 
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
          stroke="url(#waveGradient)" 
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
          stroke="url(#waveGradient)" 
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

export default Hero