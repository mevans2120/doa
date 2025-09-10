'use client'

import Image from 'next/image'

const Hero = () => {
  return (
    <section role="banner" className="relative min-h-[100vh] md:min-h-[75vh] lg:min-h-[80vh] bg-[#252525] flex items-center justify-center px-6 md:px-10 pt-16 overflow-hidden noise-overlay">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#710000] via-[#252525] to-black"></div>
      
      {/* Hero content - Centered */}
      <div className="relative z-20 text-white text-center pt-16 md:pt-20 lg:pt-24">
        <div className="relative z-20 fade-in-up">
          {/* DOA Logo - Now the hero element */}
          <div className="mb-3 flex justify-center">
            <Image
              src="/doa-logo.png"
              alt="Department of Art Logo"
              width={400}
              height={200}
              className="brightness-0 invert w-auto h-[220px] md:h-[280px] lg:h-[340px]"
              priority
            />
          </div>
          
          {/* Department of Art text below logo - Curved */}
          <div className="-mt-4">
            <svg viewBox="0 0 900 150" className="w-full max-w-5xl mx-auto h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px]">
              <defs>
                <path id="curve" d="M 50,100 Q 450,20 850,100" />
              </defs>
              <text className="bebas-font uppercase tracking-wider" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fontSize="90">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  DEPARTMENT OF ART
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-doa-silver to-transparent"></div>
    </section>
  )
}

export default Hero