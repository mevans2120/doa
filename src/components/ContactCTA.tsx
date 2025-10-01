const ContactCTA = () => {
  return (
    <section className="py-24 px-10 bg-[#252525] relative overflow-hidden" id="contact">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main heading */}
        <h2 className="text-5xl font-bold heading-font text-white mb-8">
          Ready to Begin Your Project?
        </h2>
        
        {/* Subheading */}
        <p className="text-xl heading-font text-gray-300 mb-12 leading-relaxed">
          Let&apos;s discuss your vision and bring it to life with expert craftsmanship and creative excellence.
        </p>
        
        {/* Contact information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="professional-card p-8 rounded-lg">
            <h3 className="text-xl heading-font text-white font-semibold mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3 text-gray-300 body-font">
              <div>
                <span className="heading-font font-semibold">Email:</span> info@departmentofart.com
              </div>
              <div>
                <span className="heading-font font-semibold">Phone:</span> (503) 555-0123
              </div>
              <div>
                <span className="heading-font font-semibold">Location:</span> Portland, Oregon
              </div>
            </div>
          </div>
          
          <div className="professional-card p-8 rounded-lg">
            <h3 className="text-xl heading-font text-white font-semibold mb-4">
              Project Inquiry
            </h3>
            <div className="space-y-3 text-gray-300 body-font">
              <div>Film & Television Sets</div>
              <div>Commercial Productions</div>
              <div>Custom Prop Building</div>
              <div>Design Consultation</div>
            </div>
          </div>
        </div>
        
        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a 
            href="mailto:info@departmentofart.com" 
            className="professional-btn text-lg"
          >
            Send Us an Email
          </a>
          <a 
            href="tel:+15035550123" 
            className="professional-btn-outline text-lg"
          >
            Call Us Today
          </a>
        </div>
        
        {/* Bottom tagline */}
        <div className="mt-12 text-gray-400 heading-font text-sm uppercase tracking-widest">
          Excellence • Vision • Reliable Service
        </div>
      </div>
    </section>
  )
}

export default ContactCTA