const ClientLogos = () => {
  const partners = [
    { name: 'RIOT FILMS', color: 'doa-pink', rotation: 'rotate-3' },
    { name: 'CHAOS TV', color: 'doa-neon', rotation: '-rotate-2' },
    { name: 'REBEL PROD', color: 'doa-warning', rotation: 'rotate-1' },
    { name: 'PUNK MEDIA', color: 'doa-accent', rotation: '-rotate-3' },
    { name: 'ANARCHY ADS', color: 'doa-pink', rotation: 'rotate-2' },
    { name: 'DESTROY CO', color: 'doa-neon', rotation: '-rotate-1' }
  ]

  return (
    <section className="py-20 px-10 bg-gradient-to-br from-doa-light-gray via-black to-doa-light-gray text-center relative overflow-hidden">
      {/* Background chaos */}
      <div className="absolute inset-0 grunge-bg"></div>
      
      {/* Scattered punk elements */}
      <div className="absolute top-10 left-10 w-6 h-6 border-2 border-doa-pink rotate-45 animate-spin opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 bg-doa-neon rotate-12 animate-bounce opacity-30"></div>
      
      {/* Section title */}
      <div className="relative z-10 mb-16">
        <h2 className="text-4xl font-bold font-['Creepster'] neon-text uppercase tracking-wider mb-4">
          THE SCENE TRUSTS US
        </h2>
        <div className="text-xl font-['Metal_Mania'] text-doa-accent uppercase tracking-wide">
          <span className="text-doa-neon">💀 PORTLAND&apos;S UNDERGROUND 💀</span>
        </div>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-doa-pink to-doa-neon mx-auto"></div>
      </div>
      
      {/* Partner logos as punk stickers/patches */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto items-center relative z-10">
        {partners.map((partner, index) => (
          <div
            key={index}
            className={`${partner.rotation} transform hover:scale-110 hover:rotate-0 transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] group cursor-pointer`}
          >
            {/* Punk sticker/patch style */}
            <div className={`w-32 h-20 bg-gradient-to-br from-black via-${partner.color}/30 to-black border-3 border-${partner.color} flex items-center justify-center text-xs mx-auto relative overflow-hidden jagged-border`}>
              
              {/* Grunge overlay */}
              <div className="absolute inset-0 grunge-bg opacity-40"></div>
              
              {/* Sticker content */}
              <div className="relative z-10 text-center">
                <div className={`font-['Fredoka_One'] text-${partner.color} uppercase tracking-wider text-sm group-hover:animate-pulse distressed`} data-text={partner.name}>
                  {partner.name}
                </div>
                
                {/* Punk decorative elements */}
                <div className="flex justify-center gap-1 mt-1">
                  <div className={`w-1 h-1 bg-${partner.color}`}></div>
                  <div className="w-1 h-1 bg-doa-pink"></div>
                  <div className={`w-1 h-1 bg-${partner.color}`}></div>
                </div>
              </div>
              
              {/* Corner wear effects */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-black transform rotate-45 translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-black transform rotate-45 -translate-x-1 translate-y-1"></div>
              
              {/* Scratches and wear */}
              <div className={`absolute top-1 left-1 w-4 h-0.5 bg-${partner.color} opacity-60 rotate-12`}></div>
              <div className={`absolute bottom-2 right-2 w-3 h-0.5 bg-${partner.color} opacity-40 -rotate-12`}></div>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${partner.color}/20 via-transparent to-${partner.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom section with punk attitude */}
      <div className="relative z-10 mt-16">
        <div className="text-lg font-['Metal_Mania'] text-doa-pink uppercase tracking-widest animate-pulse">
          ⚡ JOIN THE REBELLION ⚡
        </div>
        <div className="mt-2 text-sm font-['Metal_Mania'] text-doa-accent">
          READY TO MAKE SOME NOISE?
        </div>
      </div>
      
      {/* Bottom torn edge */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning torn-edge"></div>
    </section>
  )
}

export default ClientLogos