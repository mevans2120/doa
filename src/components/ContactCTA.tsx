import Link from 'next/link'

const ContactCTA = () => {
  return (
    <section className="py-32 px-10 bg-gradient-to-br from-black via-doa-light-gray to-black text-center relative overflow-hidden">
      {/* Chaotic background layers */}
      <div className="absolute inset-0 grunge-bg"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      
      {/* Animated chaos elements */}
      <div className="absolute top-10 left-10 w-16 h-16 border-4 border-doa-pink rotate-45 animate-spin opacity-20"></div>
      <div className="absolute top-20 right-20 w-12 h-12 border-4 border-doa-neon rotate-12 animate-bounce opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-10 h-10 bg-doa-warning rotate-45 animate-pulse opacity-25"></div>
      <div className="absolute bottom-10 right-10 w-8 h-8 border-4 border-doa-accent rotate-45 animate-spin opacity-35"></div>
      
      {/* Central skull with glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10 skull-icon">
        💀
      </div>
      
      {/* Main content */}
      <div className="relative z-20 max-w-4xl mx-auto">
        {/* Aggressive headline */}
        <h2 className="text-7xl font-bold font-['Creepster'] neon-text uppercase tracking-wider mb-8 leading-tight">
          <span className="block distressed" data-text="READY TO">READY TO</span>
          <span className="block text-doa-neon distressed" data-text="DESTROY">DESTROY</span>
          <span className="block text-doa-warning distressed" data-text="SOMETHING?">SOMETHING?</span>
        </h2>
        
        {/* Punk rock description */}
        <div className="text-2xl font-['Metal_Mania'] text-doa-pink mb-12 leading-relaxed max-w-3xl mx-auto">
          <p className="mb-4 uppercase tracking-wide">
            FROM CONCEPT TO COMPLETE CHAOS,
          </p>
          <p className="mb-4 text-doa-neon uppercase tracking-wide">
            WE'RE HERE TO AMPLIFY YOUR VISION
          </p>
          <p className="text-doa-accent uppercase tracking-wide">
            LET'S TALK ABOUT WHAT WE'RE DESTROYING
          </p>
        </div>
        
        {/* Multiple aggressive CTAs */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
          <Link
            href="#"
            className="punk-btn text-2xl font-['Fredoka_One'] hover:animate-shake transform hover:scale-110 transition-all duration-300"
          >
            🔥 LET'S CAUSE CHAOS 🔥
          </Link>
          
          <Link
            href="#"
            className="bg-transparent border-4 border-doa-neon text-doa-neon px-10 py-5 text-xl font-bold font-['Metal_Mania'] uppercase tracking-wider hover:bg-doa-neon hover:text-black hover:animate-pulse transition-all duration-300 jagged-border transform hover:scale-110"
          >
            ⚡ CALL THE REBELS ⚡
          </Link>
          
          <Link
            href="#"
            className="bg-transparent border-4 border-doa-warning text-doa-warning px-10 py-5 text-xl font-bold font-['Metal_Mania'] uppercase tracking-wider hover:bg-doa-warning hover:text-black hover:animate-pulse transition-all duration-300 jagged-border transform hover:scale-110"
          >
            💀 EMAIL THE CHAOS 💀
          </Link>
        </div>
        
        {/* Contact info - punk style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="punk-card p-6 text-center">
            <div className="text-3xl mb-3">📞</div>
            <div className="font-['Fredoka_One'] text-doa-pink text-lg uppercase tracking-wider mb-2">
              CALL THE CHAOS
            </div>
            <div className="font-['Metal_Mania'] text-doa-accent">
              (503) DESTROY
            </div>
          </div>
          
          <div className="punk-card p-6 text-center">
            <div className="text-3xl mb-3">✉️</div>
            <div className="font-['Fredoka_One'] text-doa-neon text-lg uppercase tracking-wider mb-2">
              EMAIL THE REBELS
            </div>
            <div className="font-['Metal_Mania'] text-doa-accent">
              chaos@doa.punk
            </div>
          </div>
          
          <div className="punk-card p-6 text-center">
            <div className="text-3xl mb-3">📍</div>
            <div className="font-['Fredoka_One'] text-doa-warning text-lg uppercase tracking-wider mb-2">
              FIND THE CHAOS
            </div>
            <div className="font-['Metal_Mania'] text-doa-accent">
              PORTLAND, OR
            </div>
          </div>
        </div>
        
        {/* Final punk rock tagline */}
        <div className="text-2xl font-['Metal_Mania'] text-doa-pink uppercase tracking-widest animate-pulse">
          ⚡ DOA: WHERE DESTRUCTION MEETS CREATION ⚡
        </div>
        
        {/* Subtitle */}
        <div className="mt-4 text-lg font-['Metal_Mania'] text-doa-accent uppercase tracking-wide">
          PORTLAND'S MOST DANGEROUS SET BUILDERS
        </div>
      </div>
      
      {/* Bottom chaos strip */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-doa-pink via-doa-neon via-doa-warning to-doa-pink torn-edge"></div>
      
      {/* Final decorative elements */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <div className="w-3 h-3 bg-doa-pink rotate-45 animate-pulse"></div>
        <div className="w-3 h-3 bg-doa-neon rotate-45 animate-pulse"></div>
        <div className="w-3 h-3 bg-doa-warning rotate-45 animate-pulse"></div>
      </div>
    </section>
  )
}

export default ContactCTA