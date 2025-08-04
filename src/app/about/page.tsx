import Header from '@/components/Header'
import Footer from '@/components/Footer'

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Michael Chen',
      role: 'Founder & Creative Director',
      bio: 'With over 20 years in production design, Michael brings a unique blend of artistic vision and technical expertise to every project.',
      image: '/team-michael.jpg'
    },
    {
      name: 'Sarah Rodriguez',
      role: 'Head of Production',
      bio: 'Sarah oversees all production logistics, ensuring projects are delivered on time and within budget while maintaining the highest quality standards.',
      image: '/team-sarah.jpg'
    },
    {
      name: 'David Park',
      role: 'Technical Director',
      bio: 'David leads our fabrication and technical teams, specializing in innovative construction techniques and visual effects integration.',
      image: '/team-david.jpg'
    },
    {
      name: 'Elena Volkov',
      role: 'Senior Art Director',
      bio: 'Elena brings international experience and a keen eye for detail, having worked on award-winning productions across three continents.',
      image: '/team-elena.jpg'
    }
  ]

  const capabilities = [
    'Full-scale set construction',
    'Custom fabrication & props',
    'Location management',
    'Art department coordination',
    'Visual effects integration',
    'Budget planning & management',
    'Sustainable production practices',
    'Rapid deployment teams',
    '24/7 production support'
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800 -z-10"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 display-font">About DOA</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Department of Art Productions is Portland&apos;s premier production design company,
            transforming creative visions into cinematic reality since 2008.
          </p>
        </section>

        {/* Company Overview */}
        <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-6 display-font">Building Worlds, Telling Stories</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Founded in the heart of Portland&apos;s creative district, DOA has grown from a small
              art department collective to a full-service production design powerhouse. We&apos;ve had
              the privilege of working on over 200 productions, from intimate independent films
              to major studio blockbusters.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Our 50,000 square foot facility houses state-of-the-art workshops, soundstages,
              and one of the region&apos;s largest prop and set dressing inventories. But what truly
              sets us apart is our team – a diverse group of artists, craftspeople, and problem
              solvers who bring passion and expertise to every project.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We believe that great production design doesn&apos;t just support the story – it elevates
              it. Whether we&apos;re building a dystopian future or recreating historical Portland,
              our commitment to authenticity, creativity, and collaboration remains constant.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-zinc-900">
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <span>{member.name}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center display-font">Our Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-lg p-6 text-center hover:bg-zinc-800 transition-colors duration-300"
              >
                <p className="text-lg">{capability}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-10 display-font">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-400">Pushing creative boundaries and embracing new technologies</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-400">Working together to achieve extraordinary results</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-400">Commitment to quality in every detail</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-400">Responsible production practices for a better future</p>
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

export default AboutPage