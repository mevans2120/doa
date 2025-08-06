'use client'

import { fonts } from '../lib/fonts'

interface ServicesProps {
  limit?: number;
}

const Services = ({ limit }: ServicesProps = {}) => {
  const services = [
    {
      id: 'graphic-renderings',
      title: 'Graphic Renderings',
      description: 'Professional 3D renderings and visualizations that bring your concepts to life before construction begins.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      )
    },
    {
      id: 'set-construction',
      title: 'Set Construction',
      description: 'Expert set building services from concept to completion, creating immersive environments for any production.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'scenic-treatments',
      title: 'Scenic Treatments',
      description: 'Specialized scenic painting and finishing techniques that add authentic texture and atmosphere to your sets.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a1 1 0 011 1v4a1 1 0 01-1 1m-5 0a1 1 0 01-1-1v-4a1 1 0 011-1m5 4h-5m-2-8h9l1 8H6l1-8zm1-3h7a1 1 0 011 1v2H6V5a1 1 0 011-1z" />
        </svg>
      )
    },
    {
      id: 'custom-welding',
      title: 'Custom Welding',
      description: 'Professional welding and metal fabrication for structural elements, custom frameworks, and artistic pieces.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 3.95-.843 1.704-1.854 3.592-2.814 5.192" />
        </svg>
      )
    },
    {
      id: 'trade-show-displays',
      title: 'Trade Show Displays',
      description: 'Eye-catching trade show booths and displays that make your brand stand out.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      )
    },
    {
      id: 'retail-fixtures',
      title: 'Retail Fixtures',
      description: 'Custom retail displays and fixtures that enhance your store environment.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'crating-services',
      title: 'Crating Services',
      description: 'Professional crating and packaging solutions for safe transport of valuable sets and props.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'materials-handling-equipment',
      title: 'Materials Handling Equipment',
      description: 'Specialized equipment for moving and handling large set pieces and production materials.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    {
      id: 'art-department-crew',
      title: 'Art Department Crew',
      description: 'Experienced art department professionals for productions of any size.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'shop-rental',
      title: 'Shop Rental',
      description: 'Fully equipped workshop spaces available for rent with professional tools and loading docks.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      )
    },
    {
      id: 'office-internet-rental',
      title: 'Office/Internet Rental',
      description: 'Production office spaces with high-speed internet and meeting rooms.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      id: 'truck-rental-supplies',
      title: 'Truck Rental and Supplies',
      description: 'Production vehicles and transportation solutions for equipment and materials.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    {
      id: 'fx-supplies-rentals',
      title: 'F/X Supplies and Rentals',
      description: 'Special effects equipment and supplies for creating memorable production moments.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  return (
    <section className="pt-7 pb-24 px-10 bg-[#252525] relative overflow-hidden" id="services" role="region">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-8 fade-in-up">
        <h2 className="heading-font text-5xl font-bold text-white mb-6">
          Our Services
        </h2>
        <div className="text-xl heading-font text-gray-300 mb-8">
          Comprehensive Set Construction & Design Solutions
        </div>
        <div className="professional-divider max-w-md mx-auto"></div>
      </div>
      
      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10">
        {services.slice(0, limit || services.length).map((service, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-lg p-8"
          >
            {/* Service icon */}
            <div className="text-white mb-6">
              {service.icon}
            </div>
            
            {/* Service title */}
            <h3 className="heading-font text-2xl font-semibold mb-4 text-white text-left">
              {service.title}
            </h3>
            
            {/* Service description */}
            <p className="text-gray-400 leading-relaxed text-left">
              {service.description}
            </p>
            
          </div>
        ))}
      </div>

      {/* View All CTA - Only show when there's a limit (i.e., not showing all services) */}
      {limit && limit < services.length && (
        <div className="text-center mt-16 relative z-10">
          <a href="/services" className="view-all-cta">
            View All Services
          </a>
        </div>
      )}

    </section>
  )
}

export default Services