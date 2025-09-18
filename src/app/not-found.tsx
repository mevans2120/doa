import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden noise-overlay">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#710000] via-[#252525] to-black opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 with skull logo */}
        <div className="flex items-center justify-center mb-8">
          <span className="bebas-font text-[120px] md:text-[160px] lg:text-[200px] text-white text-outline leading-none">4</span>
          <div className="mx-4 md:mx-6">
            <Image 
              src="/skull-white.svg" 
              alt="DOA Skull" 
              width={120} 
              height={120}
              className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
            />
          </div>
          <span className="bebas-font text-[120px] md:text-[160px] lg:text-[200px] text-white text-outline leading-none">4</span>
        </div>
        
        {/* Error message */}
        <h1 className="bebas-font text-4xl md:text-5xl lg:text-6xl text-white mb-8 text-outline">
          Page Not Found
        </h1>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-[#710000] text-white heading-font uppercase tracking-wider hover:bg-[#8b0000] transition-colors duration-300"
          >
            Return Home
          </Link>
          <Link 
            href="/projects"
            className="inline-block px-8 py-3 border-2 border-white text-white heading-font uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
          >
            View Our Work
          </Link>
        </div>
        
        {/* DOA tagline */}
        <div className="mt-16">
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            Build • Destroy
          </p>
        </div>
      </div>
      
      {/* Decorative heartbeat line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 160">
          <defs>
            <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"></stop>
              <stop offset="20%" stopColor="#710000" stopOpacity="0.4"></stop>
              <stop offset="50%" stopColor="#710000" stopOpacity="0.8"></stop>
              <stop offset="80%" stopColor="#710000" stopOpacity="0.4"></stop>
              <stop offset="100%" stopColor="transparent"></stop>
            </linearGradient>
          </defs>
          <path 
            d="M 0,80 L 400,80 L 500,80 L 520,78 L 540,82 L 560,75 L 570,85 L 580,70 L 590,90 L 595,60 L 598,30 L 600,-20 L 602,180 L 604,140 L 607,90 L 610,85 L 620,70 L 630,90 L 640,75 L 650,85 L 670,82 L 690,78 L 710,80 L 800,80 L 1200,80" 
            fill="none" 
            stroke="url(#errorGradient)" 
            strokeWidth="2" 
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  )
}