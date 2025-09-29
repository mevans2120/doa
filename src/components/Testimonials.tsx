'use client'

import { useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { featuredTestimonialsQuery } from '../../sanity/lib/queries'
import { useHomepage } from '@/contexts/HomepageContext'
import ViewfinderCorners from './ViewfinderCorners'

interface Testimonial {
  _id: string;
  title?: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

const Testimonials = () => {
  const { settings } = useHomepage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  
  const sectionTitle = settings.sectionTitles?.testimonials || ''

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await client.fetch<Testimonial[]>(featuredTestimonialsQuery)
        // If we get testimonials from Sanity, use them; otherwise use fallback
        if (data && data.length > 0) {
          setTestimonials(data.slice(0, 4)) // Show max 4 testimonials
        } else {
          // Fallback testimonials
          setTestimonials([
            {
              _id: '1',
              quote: "Department of Art delivered exceptional craftsmanship and creative vision for our feature film. Their attention to detail and professional approach made our production successful.",
              author: "Dr Doom",
              role: "Producer",
              company: "Cascade Films",
            },
            {
              _id: '2',
              quote: "Working with DOA was a game-changer for our series. They understood our vision perfectly and brought it to life with remarkable skill. Highly recommended.",
              author: "Michael Chen",
              role: "Director",
              company: "Northwest Media",
            },
            {
              _id: '3',
              quote: "The team at DOA exceeded our expectations with their innovative approach and technical expertise. They transformed our concept into a stunning visual experience that captivated our audience.",
              author: "Sarah Rodriguez",
              role: "Creative Director",
              company: "Stellar Productions",
            },
            {
              _id: '4',
              quote: "DOA's collaborative spirit and artistic excellence made them the perfect partner for our project. Their ability to adapt and deliver under tight deadlines was truly impressive.",
              author: "James Thompson",
              role: "Executive Producer",
              company: "Horizon Studios",
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        // Use fallback testimonials
        setTestimonials([
          {
            _id: '1',
            quote: "Department of Art delivered exceptional craftsmanship and creative vision for our feature film. Their attention to detail and professional approach made our production successful.",
            author: "Dr Doom",
            role: "Producer",
            company: "Cascade Films",
          },
          {
            _id: '2',
            quote: "Working with DOA was a game-changer for our series. They understood our vision perfectly and brought it to life with remarkable skill. Highly recommended.",
            author: "Michael Chen",
            role: "Director",
            company: "Northwest Media",
          },
          {
            _id: '3',
            quote: "The team at DOA exceeded our expectations with their innovative approach and technical expertise. They transformed our concept into a stunning visual experience that captivated our audience.",
            author: "Sarah Rodriguez",
            role: "Creative Director",
            company: "Stellar Productions",
          },
          {
            _id: '4',
            quote: "DOA's collaborative spirit and artistic excellence made them the perfect partner for our project. Their ability to adapt and deliver under tight deadlines was truly impressive.",
            author: "James Thompson",
            role: "Executive Producer",
            company: "Horizon Studios",
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const getSubtitle = (testimonial: Testimonial) => {
    const parts = []
    if (testimonial.role) parts.push(testimonial.role)
    if (testimonial.company) parts.push(testimonial.company)
    return parts.join(', ')
  }

  if (loading) {
    return (
      <section className="py-24 px-10 bg-black relative overflow-hidden noise-overlay paint-flecks ">
        <div className="relative z-10 text-center mb-20">
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="professional-card p-8 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-10 bg-black relative overflow-hidden noise-overlay paint-flecks ">

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