import ViewfinderCorners from './ViewfinderCorners'

interface Testimonial {
  _id: string;
  title?: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  sectionTitle: string
}

const Testimonials = ({ testimonials, sectionTitle }: TestimonialsProps) => {
  const getSubtitle = (testimonial: Testimonial) => {
    const parts = []
    if (testimonial.role) parts.push(testimonial.role)
    if (testimonial.company) parts.push(testimonial.company)
    return parts.join(', ')
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-10 bg-black relative overflow-hidden paint-flecks ">

      {/* Viewfinder corners - top left, bottom right */}
      <ViewfinderCorners pattern="left-right" />

      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
          {sectionTitle}
        </h2>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
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
              {/* Title */}
              {testimonial.title && (
                <div className="heading-font text-xl text-white font-bold mb-4">
                  {testimonial.title}
                </div>
              )}

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
                  {getSubtitle(testimonial)}
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
