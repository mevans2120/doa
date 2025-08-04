import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-10">
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
              <h3 className="text-xl font-semibold text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Department of Art
              </h3>
            </div>
            <p className="text-white body-font mb-4" style={{ color: '#ffffff' }}>
              Professional excellence in film & television set design, commercial productions, and custom prop building.
            </p>
            <div className="text-white text-sm uppercase tracking-widest" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Tagline here • Maybe?
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Contact
            </h3>
            <div className="space-y-2 text-white body-font">
              <div style={{ color: '#ffffff' }}>
                <span className="font-semibold text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>Email:</span>{' '}
                <a href="mailto:info@departmentofart.com" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>
                  info@departmentofart.com
                </a>
              </div>
              <div style={{ color: '#ffffff' }}>
                <span className="font-semibold text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>Phone:</span>{' '}
                <a href="tel:+15035550123" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>
                  (503) 555-0123
                </a>
              </div>
              <div style={{ color: '#ffffff' }}>
                <span className="font-semibold text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>Location:</span> Portland, Oregon
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
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
            <h3 className="text-xl font-semibold mb-4 text-white" style={{ color: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Quick Links
            </h3>
            <div className="space-y-2 text-white body-font">
              <div><a href="/projects" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Projects</a></div>
              <div><a href="/services" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Services</a></div>
              <div><a href="/clients" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>Clients</a></div>
              <div><a href="/about" className="text-white hover:text-gray-300 transition-colors" style={{ color: '#ffffff' }}>About</a></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-white body-font" style={{ color: '#ffffff' }}>
            © {new Date().getFullYear()} Department of Art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer