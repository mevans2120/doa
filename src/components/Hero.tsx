import Image from 'next/image'

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
    <section role="banner" className="relative min-h-[90vh] min-h-[90dvh] md:min-h-[60vh] lg:min-h-[64vh] bg-[#252525] flex items-center justify-center px-6 md:px-10 pt-16 overflow-visible">
      {/* Animated background gradient - moves opposite to navigation for complementary effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#710000] via-[#252525] to-black bg-[length:200%_200%] animate-gradient-x-reverse"
        style={{ willChange: 'background-position' }}
      ></div>

      
      {/* Hero content - Centered */}
      <div className="relative z-20 text-white text-center pt-16 md:pt-20 lg:pt-24">
        <div className="relative z-20">
          {/* DOA Logo - Now the hero element */}
          {showLogo && (
            <div className="mb-0 flex justify-center opacity-0 animate-hero-fade-in" style={{ willChange: 'opacity, transform' }}>
              <Image
                src="/doa-logo.png"
                alt="Department of Art Logo"
                width={1400}
                height={570}
                sizes="(max-width: 640px) 340px, (max-width: 768px) 440px, (max-width: 1024px) 560px, 680px"
                className="brightness-0 invert w-[340px] sm:w-[440px] md:w-[560px] lg:w-[680px] h-auto"
                priority
                fetchPriority="high"
                quality={95}
              />
            </div>
          )}

          {/* Department of Art text below logo - Curved */}
          <div className="-mt-10 opacity-0 animate-hero-fade-in-delay-1" style={{ willChange: 'opacity, transform' }}>
            <svg viewBox="0 0 900 150" className="w-full max-w-6xl mx-auto h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px]">
              <defs>
                <path id="curve" d="M 50,100 Q 450,20 850,100" />
              </defs>
              <text className="bebas-font uppercase tracking-wider" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fontSize="90">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
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