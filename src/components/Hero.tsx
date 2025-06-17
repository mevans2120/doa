import Link from 'next/link'

const Hero = () => {
  return (
    <section role="banner" className="relative h-[700px] bg-black flex items-center px-10 overflow-hidden">
      {/* Chaotic background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-doa-light-gray to-black"></div>
      <div className="absolute inset-0 grunge-bg"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/80"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-4 border-doa-neon rotate-45 animate-spin opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 border-4 border-doa-warning rotate-12 animate-pulse opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-doa-pink rotate-45 animate-bounce opacity-25"></div>
      
      {/* Massive skull watermark */}
      <div className="absolute right-[-100px] top-1/2 transform -translate-y-1/2 w-80 h-96 z-10 text-doa-pink opacity-20 flex items-center justify-center">
        <div className="text-9xl skull-icon filter drop-shadow-[0_0_30px_rgba(255,0,128,0.5)]">
          💀
        </div>
      </div>
      
      {/* Glitch overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-doa-pink/5 to-transparent animate-pulse"></div>
      
      {/* Hero content */}
      <div className="relative z-20 text-doa-pink max-w-3xl">
        <div className="relative z-20">
          {/* Main headline with punk styling */}
          <h1 className="text-7xl font-bold mb-8 leading-tight font-['Creepster'] neon-text uppercase tracking-wider">
            <span className="block distressed" data-text="DOA DESTROYS">DOA DESTROYS</span>
            <span className="block text-doa-neon distressed" data-text="& REBUILDS">& REBUILDS</span>
            <span className="block text-doa-warning distressed" data-text="YOUR VISION">YOUR VISION</span>
          </h1>
          
          {/* Subheading with attitude */}
          <p className="text-3xl mb-10 font-['Metal_Mania'] text-doa-accent uppercase tracking-wide">
            <span className="block">FILM • TV • COMMERCIAL</span>
            <span className="block text-doa-neon">SET DESTRUCTION &amp; CONSTRUCTION</span>
            <span className="block text-doa-warning">NO COMPROMISE • NO LIMITS</span>
          </p>
          
          {/* Aggressive CTA button */}
          <div className="flex gap-6">
            <Link
              href="#"
              className="punk-btn text-xl font-['Fredoka_One'] hover:animate-shake"
            >
              🔥 LET&apos;S DESTROY SOMETHING 🔥
            </Link>
            
            <Link
              href="#"
              className="bg-transparent border-4 border-doa-neon text-doa-neon px-8 py-4 text-lg font-bold font-['Metal_Mania'] uppercase tracking-wider hover:bg-doa-neon hover:text-black hover:animate-pulse transition-all duration-300 jagged-border"
            >
              SEE THE CHAOS
            </Link>
          </div>
          
          {/* Punk rock tagline */}
          <div className="mt-8 text-doa-pink font-['Metal_Mania'] text-lg uppercase tracking-widest opacity-80">
            <span className="animate-pulse">⚡ PORTLAND&apos;S MOST DANGEROUS SET BUILDERS ⚡</span>
          </div>
        </div>
      </div>
      
      {/* Bottom torn edge effect */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning torn-edge"></div>
    </section>
  )
}

export default Hero