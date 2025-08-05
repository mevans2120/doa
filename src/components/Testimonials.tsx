import { fonts } from '../lib/fonts'

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Department of Art delivered exceptional craftsmanship and creative vision for our feature film. Their attention to detail and professional approach made our production successful.",
      author: "Dr Doom",
      subtitle: "Producer, Cascade Films",
    },
    {
      quote: "Working with DOA was a game-changer for our series. They understood our vision perfectly and brought it to life with remarkable skill. Highly recommended.",
      author: "Michael Chen",
      subtitle: "Director, Northwest Media",
    },
    {
      quote: "The team at DOA exceeded our expectations with their innovative approach and technical expertise. They transformed our concept into a stunning visual experience that captivated our audience.",
      author: "Sarah Rodriguez",
      subtitle: "Creative Director, Stellar Productions",
    },
    {
      quote: "DOA's collaborative spirit and artistic excellence made them the perfect partner for our project. Their ability to adapt and deliver under tight deadlines was truly impressive.",
      author: "James Thompson",
      subtitle: "Executive Producer, Horizon Studios",
    }
  ]

  return (
    <section className="py-24 px-10 bg-[#252525] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className={`${fonts.display} text-5xl font-bold text-white mb-6`}>
          Client Testimonials
        </h2>
        <div className="text-xl heading-font text-gray-300 mb-8">
          What its like to work with us
        </div>
        <div className="professional-divider max-w-md mx-auto"></div>
      </div>
      
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="professional-card p-8 rounded-lg relative overflow-hidden group"
          >
            {/* Quote marks */}
            <div className="text-4xl heading-font text-doa-silver opacity-30 absolute top-4 left-4 leading-none">
              &quot;
            </div>
            <div className="text-4xl heading-font text-doa-silver opacity-30 absolute bottom-4 right-4 leading-none rotate-180">
              &quot;
            </div>
            
            {/* Review content */}
            <div className="relative z-10 pt-8">
              {/* Quote */}
              <div className="text-lg body-font text-gray-200 leading-relaxed mb-6 italic">
                {testimonial.quote}
              </div>
              
              {/* Author info */}
              <div className="border-t border-doa-silver/20 pt-4">
                <div className="heading-font text-white text-lg font-semibold mb-1">
                  {testimonial.author}
                </div>
                <div className="heading-font text-doa-silver text-sm">
                  {testimonial.subtitle}
                </div>
              </div>
            </div>
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-doa-silver"></div>
          </div>
        ))}
      </div>
      
    </section>
  )
}

export default Testimonials