import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Ben Haden',
      role: 'Founder & Creative Director',
      bio: 'With over 20 years in production design, Ben brings a unique blend of artistic vision and technical expertise to every project.',
      image: '/Ben.jpeg'
    },
    {
      name: 'Chandler Vinar',
      role: 'Head of Production',
      bio: 'Chandler oversees all production logistics, ensuring projects are delivered on time and within budget while maintaining the highest quality standards.',
      image: '/Chandler.jpeg'
    },
    {
      name: 'Jeff Johnson',
      role: 'Technical Director',
      bio: 'Jeff leads our fabrication and technical teams, specializing in innovative construction techniques and visual effects integration.',
      image: '/JEff.jpeg'
    }
  ]


  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen text-white bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="text-center mb-20 fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-6 display-font">About DOA</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            Department of Art Productions is Portland&apos;s premier production design company,
            transforming creative visions into cinematic reality since 2008.
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </section>

        {/* Company Overview */}
        <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-6 display-font">Building Worlds, Telling Stories</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Department of Art is a full service scenery shop, supporting the local film/photo community
              for the last 20 years. Set construction, custom prop building, graphics and scenic treatments
              are just some of the services we offer.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              DOA also fabricates retail fixtures, professional trade show displays, and provides services
              for special events and product launches.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The three partners at Department of Art are all 20+ year veterans in the film industry,
              having filled every role from production designer, art director, prop master, decorator,
              lead man, and set dresser. All partners still actively work in the industry thus, DOA can
              be seen as "one stop shopping" for productions seeking all things art department. We can
              provide crew for your shoot, a place for that crew to work, provide internet and office
              needs, gated parking, and trucking for any size production. And when you&apos;re done for
              the day... enjoy a cold beer in our bar and a game of pinball.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden bg-zinc-900">
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
              <span>Company Image</span>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20 bg-zinc-900 rounded-lg p-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To deliver exceptional production design services that bring creative visions to life,
                while fostering innovation, sustainability, and artistic excellence in everything we do.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To be the Pacific Northwest&apos;s most trusted production design partner, known for our
                creativity, reliability, and commitment to pushing the boundaries of what&apos;s possible
                in visual storytelling.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center display-font">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-zinc-900 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage