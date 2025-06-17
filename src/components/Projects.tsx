const Projects = () => {
  const projects = [
    {
      title: 'APOCALYPSE SET',
      subtitle: 'HORROR FILM',
      description: 'Post-apocalyptic wasteland that made audiences scream',
      color: 'doa-pink',
      rotation: 'rotate-2'
    },
    {
      title: 'NEON NIGHTMARE',
      subtitle: 'MUSIC VIDEO',
      description: 'Cyberpunk chaos for underground band',
      color: 'doa-neon',
      rotation: '-rotate-1'
    },
    {
      title: 'URBAN DECAY',
      subtitle: 'COMMERCIAL',
      description: 'Gritty street scene that sold rebellion',
      color: 'doa-warning',
      rotation: 'rotate-1'
    },
    {
      title: 'PUNK VENUE',
      subtitle: 'COMMUNITY SPACE',
      description: 'Underground club where chaos lives',
      color: 'doa-accent',
      rotation: '-rotate-2'
    }
  ]

  return (
    <section role="region" className="py-24 px-10 bg-black relative overflow-hidden">
      {/* Grunge background */}
      <div className="absolute inset-0 grunge-bg"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-doa-light-gray/20 via-transparent to-doa-light-gray/20"></div>
      
      {/* Scattered punk elements */}
      <div className="absolute top-16 right-20 w-12 h-12 border-4 border-doa-pink rotate-45 animate-spin opacity-20"></div>
      <div className="absolute bottom-20 left-16 w-8 h-8 bg-doa-neon rotate-12 animate-bounce opacity-30"></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-doa-warning animate-pulse opacity-40"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20">
        <h2 className="text-6xl font-bold font-['Creepster'] neon-text uppercase tracking-wider mb-4">
          CHAOS WE'VE CREATED
        </h2>
        <div className="text-2xl font-['Metal_Mania'] text-doa-accent uppercase tracking-wide">
          <span className="text-doa-neon">💀 RECENT DESTRUCTION 💀</span>
        </div>
        <div className="mt-6 w-40 h-1 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning mx-auto"></div>
      </div>
      
      {/* Projects grid - punk poster wall style */}
      <div
        data-testid="projects-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10"
      >
        {projects.map((project, index) => (
          <div
            key={index}
            className={`punk-card ${project.rotation} transform hover:scale-110 hover:rotate-0 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,128,0.6)] relative overflow-hidden group cursor-pointer`}
          >
            {/* Poster-style background */}
            <div className={`w-full h-80 bg-gradient-to-br from-black via-${project.color}/20 to-black flex flex-col items-center justify-center text-center p-6 relative`}>
              
              {/* Grunge overlay */}
              <div className="absolute inset-0 grunge-bg opacity-30"></div>
              
              {/* Torn paper effect at top */}
              <div className={`absolute top-0 left-0 right-0 h-4 bg-${project.color} torn-edge`}></div>
              
              {/* Project content */}
              <div className="relative z-10">
                {/* Main title */}
                <h3 className={`text-3xl font-['Fredoka_One'] text-${project.color} uppercase tracking-wider mb-3 distressed group-hover:animate-pulse`} data-text={project.title}>
                  {project.title}
                </h3>
                
                {/* Subtitle */}
                <div className="text-lg font-['Metal_Mania'] text-doa-accent uppercase tracking-wide mb-4 border-2 border-doa-accent px-3 py-1 inline-block">
                  {project.subtitle}
                </div>
                
                {/* Description */}
                <p className="text-doa-pink font-['Metal_Mania'] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                
                {/* Punk decorative elements */}
                <div className="flex justify-center gap-2 mb-4">
                  <div className={`w-3 h-3 bg-${project.color} rotate-45`}></div>
                  <div className="w-3 h-3 bg-doa-pink rotate-45"></div>
                  <div className={`w-3 h-3 bg-${project.color} rotate-45`}></div>
                </div>
                
                {/* View project button */}
                <div className={`text-xs font-['Metal_Mania'] text-${project.color} uppercase tracking-widest border border-${project.color} px-4 py-2 hover:bg-${project.color} hover:text-black transition-all duration-300`}>
                  VIEW DESTRUCTION
                </div>
              </div>
              
              {/* Corner rips */}
              <div className="absolute top-2 right-2 w-4 h-4 bg-black transform rotate-45"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-black transform rotate-45"></div>
              
              {/* Staple effects */}
              <div className="absolute top-4 left-4 w-2 h-1 bg-gray-400"></div>
              <div className="absolute top-4 right-4 w-2 h-1 bg-gray-400"></div>
            </div>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${project.color}/20 via-transparent to-${project.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>
      
      {/* Bottom section */}
      <div className="relative z-10 text-center mt-20">
        <div className="text-xl font-['Metal_Mania'] text-doa-pink uppercase tracking-widest animate-pulse">
          ⚡ MORE CHAOS COMING SOON ⚡
        </div>
        <div className="mt-4 text-lg font-['Metal_Mania'] text-doa-accent">
          READY TO DESTROY SOMETHING BEAUTIFUL?
        </div>
      </div>
      
      {/* Bottom torn edge */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning torn-edge"></div>
    </section>
  )
}

export default Projects