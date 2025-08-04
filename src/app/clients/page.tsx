'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ClientsPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const clientLogos = [
    { name: 'Paramount Pictures', logo: '/client-paramount.png' },
    { name: 'Warner Bros.', logo: '/client-warner.png' },
    { name: 'Netflix', logo: '/client-netflix.png' },
    { name: 'HBO', logo: '/client-hbo.png' },
    { name: 'A24 Films', logo: '/client-a24.png' },
    { name: 'Apple TV+', logo: '/client-apple.png' },
    { name: 'Amazon Studios', logo: '/client-amazon.png' },
    { name: 'Focus Features', logo: '/client-focus.png' },
    { name: 'Discovery+', logo: '/client-discovery.png' },
    { name: 'Hulu', logo: '/client-hulu.png' },
    { name: 'Sony Pictures', logo: '/client-sony.png' },
    { name: 'Universal', logo: '/client-universal.png' }
  ]

  const clientProjects = [
    {
      client: 'Paramount Pictures',
      projects: ['Echoes of Tomorrow', 'Quantum Paradox', 'The Last Frontier'],
      description: 'Long-standing partnership creating immersive sci-fi environments and period sets for major theatrical releases.'
    },
    {
      client: 'Netflix',
      projects: ['Portland Files', 'Midnight Society', 'The Architect'],
      description: 'Collaborated on multiple series, delivering versatile sets that support quick turnarounds and episodic production schedules.'
    },
    {
      client: 'HBO',
      projects: ['Corporate Shadows', 'Westworld Portland Unit', 'True Detective: Northwest'],
      description: 'Premium production design for prestige television, focusing on cinematic quality and intricate detail work.'
    },
    {
      client: 'A24 Films',
      projects: ['The Last Station', 'Moonrise', 'Everything Everywhere All at Once - Portland Unit'],
      description: 'Artistic collaboration on visually distinctive independent films, pushing creative boundaries with innovative design solutions.'
    },
    {
      client: 'Apple TV+',
      projects: ['The Morning Show - Portland Unit', 'See - Forest Sequences', 'Foundation - Earth Scenes'],
      description: 'High-concept production design for streaming content, integrating cutting-edge technology with practical effects.'
    },
    {
      client: 'Warner Bros.',
      projects: ['Neon Nights', 'Gotham City Chronicles', 'Blade Runner 2099'],
      description: 'Large-scale builds for blockbuster productions, specializing in urban environments and futuristic cityscapes.'
    }
  ]

  const testimonials = [
    {
      quote: "DOA's attention to detail and creative problem-solving transformed our vision into reality. Their team built a three-story cyberpunk marketplace that exceeded our wildest expectations.",
      author: "Sarah Chen",
      title: "Production Designer, Paramount Pictures",
      project: "Echoes of Tomorrow"
    },
    {
      quote: "Working with DOA was a game-changer for our series. They delivered a fully functional police precinct that could be quickly redressed for multiple locations, saving us time and money.",
      author: "Michael Rodriguez",
      title: "Director, Netflix",
      project: "Portland Files"
    },
    {
      quote: "The craftsmanship and artistry DOA brings to every project is unparalleled. They don't just build sets, they create worlds that actors can truly inhabit.",
      author: "Elena Volkov",
      title: "Production Designer, HBO",
      project: "Corporate Shadows"
    },
    {
      quote: "DOA understood our aesthetic immediately and delivered a hauntingly beautiful abandoned subway station that became a character in itself. Their collaborative approach made the impossible possible.",
      author: "Angela Washington",
      title: "Director, A24 Films",
      project: "The Last Station"
    },
    {
      quote: "From concept to construction, DOA's team demonstrated exceptional professionalism and creativity. They built our futuristic smart home in record time without compromising on quality.",
      author: "David Park",
      title: "Creative Director, Apple",
      project: "Tech Innovation Campaign"
    }
  ]

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800 -z-10"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-16 text-center display-font">Our Clients</h1>

        {/* Client Logos */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center display-font">Trusted By Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="bg-zinc-900 rounded-lg p-8 flex items-center justify-center hover:bg-zinc-800 transition-colors duration-300"
              >
                <div className="text-gray-400 text-center">
                  <div className="h-16 flex items-center justify-center mb-2">
                    {/* Placeholder for logo */}
                    <span className="text-sm font-medium">{client.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Client Projects */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center display-font">Featured Collaborations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clientProjects.map((client, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-lg p-8 hover:bg-zinc-800 transition-colors duration-300"
              >
                <h3 className="text-2xl font-semibold mb-3">{client.client}</h3>
                <p className="text-gray-400 mb-4">{client.description}</p>
                <div className="border-t border-zinc-700 pt-4">
                  <p className="text-sm text-gray-500 mb-2">Notable Projects:</p>
                  <ul className="list-disc list-inside text-gray-300">
                    {client.projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-3xl font-semibold mb-10 text-center display-font">What Our Clients Say</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-zinc-900 rounded-lg p-12">
              <svg className="w-12 h-12 text-gray-600 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-xl leading-relaxed mb-8">
                {testimonials[activeTestimonial].quote}
              </blockquote>
              <div>
                <p className="font-semibold">{testimonials[activeTestimonial].author}</p>
                <p className="text-gray-400">{testimonials[activeTestimonial].title}</p>
                <p className="text-gray-500 text-sm mt-1">{testimonials[activeTestimonial].project}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === activeTestimonial ? 'bg-white' : 'bg-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ClientsPage