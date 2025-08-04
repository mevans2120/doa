const ClientLogos = () => {
  const clients = [
    {
      name: "Northwest Studios",
      type: "Film Production"
    },
    {
      name: "Cascade Media",
      type: "Television Network"
    },
    {
      name: "Portland Creative",
      type: "Commercial Agency"
    },
    {
      name: "Pacific Films",
      type: "Independent Studio"
    },
    {
      name: "Oregon Broadcasting",
      type: "Media Company"
    },
    {
      name: "Creative Collective",
      type: "Production House"
    }
  ]

  return (
    <section className="py-24 px-10 bg-[#252525] relative overflow-hidden" id="clients">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Section title */}
      <div className="relative z-10 text-center mb-20 fade-in-up">
        <h2 className="text-5xl font-bold heading-font text-white mb-6">
          Our Clients
        </h2>
        <div className="text-xl heading-font text-gray-300 mb-8">
          Partnering Together in Creative Excellence
        </div>
        <div className="professional-divider max-w-md mx-auto"></div>
      </div>
      
      {/* Client grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto relative z-10">
        {clients.map((client, index) => (
          <div
            key={index}
            className="professional-card p-6 text-center transform transition-all duration-300 hover:scale-105 relative overflow-hidden group rounded-lg"
          >
            {/* Client logo placeholder */}
            <div className="w-full h-20 image-wireframe mb-4 rounded flex items-center justify-center">
              <span className="text-xs">Logo</span>
            </div>
            
            {/* Client name */}
            <h3 className="text-sm heading-font text-white font-semibold mb-1">
              {client.name}
            </h3>
            
            {/* Client type */}
            <div className="text-xs heading-font text-doa-gold">
              {client.type}
            </div>
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-doa-gold"></div>
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