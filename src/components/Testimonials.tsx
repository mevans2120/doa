const Testimonials = () => {
  const testimonials = [
    {
      quote: "DOA doesn't just build sets - they create CHAOS that makes audiences lose their minds. These maniacs delivered our apocalyptic nightmare on time and under budget. PURE DESTRUCTION!",
      author: "— RIOT PRODUCTIONS",
      subtitle: "HORROR FILM COLLECTIVE",
      rating: "★★★★★",
      color: "doa-pink"
    },
    {
      quote: "These punks are the ONLY team in Portland that gets it. They don't just understand our vision - they AMPLIFY it into something beautiful and terrifying. Underground legends!",
      author: "— CHAOS CINEMA",
      subtitle: "INDEPENDENT FILM REBELS",
      rating: "★★★★★",
      color: "doa-neon"
    }
  ]

  return (
    <section className="py-24 px-10 bg-black relative overflow-hidden">
      {/* Grunge background */}
      <div className="absolute inset-0 grunge-bg"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-doa-light-gray/10 via-transparent to-doa-light-gray/10"></div>
      
      {/* Scattered punk elements */}
      <div className="absolute top-20 right-20 w-10 h-10 border-3 border-doa-pink rotate-45 animate-spin opacity-20"></div>
      <div className="absolute bottom-32 left-16 w-6 h-6 bg-doa-neon rotate-12 animate-bounce opacity-30"></div>
      <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-doa-warning animate-pulse opacity-40"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20">
        <h2 className="text-6xl font-bold font-['Creepster'] neon-text uppercase tracking-wider mb-4">
          WHAT THE SCENE SAYS
        </h2>
        <div className="text-2xl font-['Metal_Mania'] text-doa-accent uppercase tracking-wide">
          <span className="text-doa-neon">💀 UNDERGROUND REVIEWS 💀</span>
        </div>
        <div className="mt-6 w-40 h-1 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning mx-auto"></div>
      </div>
      
      {/* Testimonials as punk zine reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`punk-card p-8 transform hover:scale-105 hover:rotate-1 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] relative overflow-hidden group`}
          >
            {/* Zine-style background */}
            <div className="absolute inset-0 grunge-bg opacity-20"></div>
            
            {/* Torn paper effect at top */}
            <div className={`absolute top-0 left-0 right-0 h-3 bg-${testimonial.color} torn-edge`}></div>
            
            {/* Quote marks - punk style */}
            <div className={`text-6xl font-['Creepster'] text-${testimonial.color} opacity-30 absolute top-4 left-4 leading-none`}>
              "
            </div>
            <div className={`text-6xl font-['Creepster'] text-${testimonial.color} opacity-30 absolute bottom-4 right-4 leading-none rotate-180`}>
              "
            </div>
            
            {/* Review content */}
            <div className="relative z-10 pt-8">
              {/* Rating stars */}
              <div className={`text-2xl text-${testimonial.color} mb-4 font-bold tracking-wider`}>
                {testimonial.rating}
              </div>
              
              {/* Quote */}
              <div className="text-lg font-['Metal_Mania'] text-doa-pink leading-relaxed mb-6 italic">
                {testimonial.quote}
              </div>
              
              {/* Author info */}
              <div className="border-t-2 border-doa-accent pt-4">
                <div className={`font-['Fredoka_One'] text-${testimonial.color} text-xl uppercase tracking-wider mb-1 distressed`} data-text={testimonial.author}>
                  {testimonial.author}
                </div>
                <div className="font-['Metal_Mania'] text-doa-accent text-sm uppercase tracking-wide">
                  {testimonial.subtitle}
                </div>
              </div>
              
              {/* Punk decorative elements */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-1">
                  <div className={`w-2 h-2 bg-${testimonial.color} rotate-45`}></div>
                  <div className="w-2 h-2 bg-doa-pink rotate-45"></div>
                  <div className={`w-2 h-2 bg-${testimonial.color} rotate-45`}></div>
                </div>
                <div className="text-xs font-['Metal_Mania'] text-doa-accent uppercase tracking-widest">
                  VERIFIED CHAOS
                </div>
              </div>
            </div>
            
            {/* Corner rips and wear */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-black transform rotate-45"></div>
            
            {/* Staple effects */}
            <div className="absolute top-6 left-6 w-2 h-1 bg-gray-400"></div>
            <div className="absolute top-6 right-6 w-2 h-1 bg-gray-400"></div>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${testimonial.color}/20 via-transparent to-${testimonial.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>
      
      {/* Bottom section */}
      <div className="relative z-10 text-center mt-20">
        <div className="text-xl font-['Metal_Mania'] text-doa-pink uppercase tracking-widest animate-pulse">
          ⚡ READY TO JOIN THE TESTIMONIALS? ⚡
        </div>
        <div className="mt-4 text-lg font-['Metal_Mania'] text-doa-accent">
          LET'S CREATE SOME BEAUTIFUL DESTRUCTION
        </div>
      </div>
      
      {/* Bottom torn edge */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-doa-pink via-doa-neon to-doa-warning torn-edge"></div>
    </section>
  )
}

export default Testimonials