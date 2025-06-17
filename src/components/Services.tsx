const Services = () => {
  const services = [
    {
      title: 'SET DESTRUCTION',
      subtitle: 'TEAR IT DOWN',
      description: 'We demolish reality and rebuild your wildest nightmares. No set too big, no vision too insane.',
      icon: '🔨',
      color: 'doa-pink'
    },
    {
      title: 'SCENIC CHAOS',
      subtitle: 'PAINT THE REBELLION',
      description: 'Graffiti-style scenic painting that screams attitude. We make walls bleed character.',
      icon: '🎨',
      color: 'doa-neon'
    },
    {
      title: 'COMMUNITY ANARCHY',
      subtitle: 'UNITE THE SCENE',
      description: 'Building spaces where creatives can unleash hell. Your hub for underground collaboration.',
      icon: '⚡',
      color: 'doa-warning'
    }
  ]

  return (
    <section className="py-24 px-10 bg-gradient-to-br from-black via-doa-light-gray to-black relative overflow-hidden">
      {/* Background chaos */}
      <div className="absolute inset-0 grunge-bg"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning"></div>
      
      {/* Scattered punk elements */}
      <div className="absolute top-20 left-20 w-8 h-8 border-2 border-doa-pink rotate-45 animate-spin opacity-30"></div>
      <div className="absolute bottom-32 right-32 w-6 h-6 bg-doa-neon rotate-12 animate-bounce opacity-40"></div>
      <div className="absolute top-1/2 left-10 w-4 h-4 bg-doa-warning animate-pulse opacity-50"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-6xl font-bold font-['Creepster'] neon-text uppercase tracking-wider mb-4">
          WHAT WE DESTROY
        </h2>
        <div className="text-2xl font-['Metal_Mania'] text-doa-accent uppercase tracking-wide">
          <span className="text-doa-neon">⚡ AND REBUILD ⚡</span>
        </div>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-doa-pink to-doa-neon mx-auto"></div>
      </div>
      
      {/* Services grid - punk flyer style */}
      <div
        data-testid="services-grid"
        className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto relative z-10"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className={`punk-card text-center p-8 transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] jagged-border relative overflow-hidden group`}
          >
            {/* Card background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
            </div>
            
            {/* Punk icon */}
            <div
              data-testid="service-icon"
              className={`w-24 h-24 mx-auto mb-6 flex items-center justify-center text-5xl bg-gradient-to-br from-${service.color} to-black border-4 border-${service.color} jagged-border group-hover:animate-pulse relative`}
            >
              <span className="filter drop-shadow-[0_0_10px_rgba(255,0,128,0.8)]">
                {service.icon}
              </span>
            </div>
            
            {/* Service title */}
            <h3 className={`text-2xl mb-2 font-['Fredoka_One'] text-${service.color} uppercase tracking-wider distressed`} data-text={service.title}>
              {service.title}
            </h3>
            
            {/* Subtitle */}
            <div className="text-lg font-['Metal_Mania'] text-doa-accent uppercase tracking-wide mb-4">
              {service.subtitle}
            </div>
            
            {/* Description */}
            <p className="text-doa-pink font-['Metal_Mania'] leading-relaxed">
              {service.description}
            </p>
            
            {/* Punk accent line */}
            <div className={`mt-6 h-1 bg-gradient-to-r from-transparent via-${service.color} to-transparent`}></div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
      
      {/* Bottom section with attitude */}
      <div className="relative z-10 text-center mt-16">
        <div className="text-xl font-['Metal_Mania'] text-doa-pink uppercase tracking-widest animate-pulse">
          💀 NO LIMITS • NO COMPROMISE • NO FEAR 💀
        </div>
      </div>
      
      {/* Bottom torn edge */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning torn-edge"></div>
    </section>
  )
}

export default Services