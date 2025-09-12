import Image from 'next/image'
import Link from 'next/link'
import EKGDivider from './EKGDivider'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-10 relative noise-overlay paint-flecks">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/doa-logo.png"
                alt="Department of Art"
                width={50}
                height={50}
                className="mr-3 brightness-0 invert"
              />
              <h3 className="bebas-font text-xl text-white text-outline whitespace-nowrap">
                DEPARTMENT OF ART
              </h3>
            </div>
            <p className="text-white body-font mb-4" style={{ color: '#ffffff' }}>
              Professional excellence in film & television set design, commercial productions, and custom prop building.
            </p>
            <div className="text-white text-sm uppercase tracking-widest" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Build • Destroy
            </div>
          </div>
          
          {/* Location */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white heading-font">
              Location
            </h3>
            <div className="space-y-3 text-white body-font">
              <div style={{ color: '#ffffff' }}>
                <p className="mb-2">
                  Department of Art Productions<br />
                  6500 NE Portland Hwy<br />
                  Portland, OR 97218
                </p>
              </div>
              <div>
                <a
                  href="https://maps.google.com/?q=6500+NE+Portland+Hwy+Portland+OR+97218"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
                  style={{ color: '#ffffff' }}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white heading-font">
              Services
            </h3>
            <div className="space-y-2 text-white body-font">
              <div style={{ color: '#ffffff' }}>Film & Television Sets</div>
              <div style={{ color: '#ffffff' }}>Commercial Productions</div>
              <div style={{ color: '#ffffff' }}>Custom Prop Building</div>
              <div style={{ color: '#ffffff' }}>Design Consultation</div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white heading-font">
              Quick Links
            </h3>
            <div className="space-y-2 text-white body-font">
              <div><Link href="/" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Home</Link></div>
              <div><Link href="/projects" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Our Work</Link></div>
              <div><Link href="/services" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>What We Do</Link></div>
              <div><Link href="/clients" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Our Clients</Link></div>
              <div><Link href="/about" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>About</Link></div>
              <div><Link href="/contact" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Contact</Link></div>
            </div>
          </div>
        </div>
        
        {/* EKG Divider - positioned to overlay content */}
        <div className="relative h-20 -mt-8">
          <div className="absolute inset-0 z-50">
            <EKGDivider />
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="text-center pb-4">
          <p className="text-white body-font" style={{ color: '#ffffff' }}>
            © {new Date().getFullYear()} Department of Art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer