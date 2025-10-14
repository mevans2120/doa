'use client'

import { useSiteSettings } from '@/contexts/SiteSettingsContext'

const ContactCTA = () => {
  const { settings } = useSiteSettings()

  // Format phone number for tel: link
  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/\D/g, '')
  }

  // Get location display
  const getLocationDisplay = () => {
    if (settings.address?.city && settings.address?.state) {
      return `${settings.address.city}, ${settings.address.state}`
    }
    return 'Portland, Oregon'
  }

  const contactEmail = settings.contactEmail || 'info@departmentofart.com'
  const contactPhone = settings.contactPhone || '(503) 555-0123'
  const phoneLink = formatPhoneForLink(contactPhone)

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
                <span className="heading-font font-semibold">Email:</span> {contactEmail}
              </div>
              {contactPhone && (
                <div>
                  <span className="heading-font font-semibold">Phone:</span> {contactPhone}
                </div>
              )}
              <div>
                <span className="heading-font font-semibold">Location:</span> {getLocationDisplay()}
              </div>
            </div>
          </div>

          <div className="professional-card p-8 rounded-lg">
            <h3 className="text-xl heading-font text-white font-semibold mb-4">
              Project Inquiry
            </h3>
            <div className="space-y-3 text-gray-300 body-font">
              {settings.footer?.services?.slice(0, 4).map((service, index) => (
                <div key={index}>{service}</div>
              )) || (
                <>
                  <div>Film & Television Sets</div>
                  <div>Commercial Productions</div>
                  <div>Custom Prop Building</div>
                  <div>Design Consultation</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href={`mailto:${contactEmail}`}
            className="professional-btn text-lg"
          >
            Send Us an Email
          </a>
          {contactPhone && (
            <a
              href={`tel:+1${phoneLink}`}
              className="professional-btn-outline text-lg"
            >
              Call Us Today
            </a>
          )}
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