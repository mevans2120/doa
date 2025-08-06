import Image from 'next/image'

const ClientLogos = () => {
  const clients = [
    {
      name: "Netflix",
      logo: "/Netflix_2015_logo.svg"
    },
    {
      name: "Microsoft",
      logo: "/Microsoft_logo_(2012).svg"
    },
    {
      name: "Nike",
      logo: "/Logo_NIKE.svg"
    },
    {
      name: "Intel",
      logo: "/Intel_logo_(2020,_light_blue).svg"
    },
    {
      name: "Amazon Studios",
      logo: "/Amazon_logo.svg"
    },
    {
      name: "Columbia Sportswear",
      logo: "/Columbia_Sportswear_Co_logo.svg"
    }
  ]

  return (
    <section className="py-24 px-10 bg-[#252525] relative overflow-hidden" id="clients">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="heading-font text-5xl font-bold text-white mb-6">
          Our Clients
        </h2>
        <div className="text-xl heading-font text-gray-300 mb-8">
          Partnering Together in Creative Excellence
        </div>
        <div className="professional-divider max-w-md mx-auto"></div>
      </div>
      
      {/* Client grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto relative z-10">
        {clients.map((client, index) => (
          <div
            key={index}
            className="professional-card p-6 text-center relative overflow-hidden rounded-lg"
          >
            {/* Client logo */}
            <div className="w-full h-20 flex items-center justify-center relative">
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={140}
                height={70}
                className="object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-doa-silver"></div>
          </div>
        ))}
      </div>
      
      {/* View All CTA */}
      <div className="text-center mt-16 relative z-10">
        <a href="/clients" className="view-all-cta">
          View All Clients
        </a>
      </div>

    </section>
  )
}

export default ClientLogos