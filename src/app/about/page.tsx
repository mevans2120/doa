import Header from '@/components/Header'
import Footer from '@/components/Footer'

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Ben Haden',
      role: 'Founder & Creative Director',
      bio: 'With over 20 years in production design, Ben brings a unique blend of artistic vision and technical expertise to every project.',
      image: '/team-ben.jpg'
    },
    {
      name: 'Chandler Vinar',
      role: 'Head of Production',
      bio: 'Chandler oversees all production logistics, ensuring projects are delivered on time and within budget while maintaining the highest quality standards.',
      image: '/team-chandler.jpg'
    },
    {
      name: 'Jeff Johnson',
      role: 'Technical Director',
      bio: 'Jeff leads our fabrication and technical teams, specializing in innovative construction techniques and visual effects integration.',
      image: '/team-jeff.jpg'
    }
  ]


  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen text-white bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800">
        <div className="py-20">
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
        <section>
          <h2 className="text-3xl font-semibold mb-10 text-center display-font">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage