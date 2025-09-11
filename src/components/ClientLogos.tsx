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
    <section className="py-24 px-10 bg-black relative overflow-hidden noise-overlay paint-flecks" id="clients">
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
          Our Clients
        </h2>
      </div>
      
      {/* Client grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto relative z-10">
        {clients.map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-center"
          >
            <Image
              src={client.logo}
              alt={`${client.name} logo`}
              width={140}
              height={70}
              className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
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