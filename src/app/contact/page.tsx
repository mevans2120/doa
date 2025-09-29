'use client'

import { useState, useEffect, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client } from '../../../sanity/lib/client'
import { contactPageQuery, siteSettingsQuery } from '../../../sanity/lib/queries'

interface ContactPageData {
  hero?: {
    title?: string
    subtitle?: string
  }
  contactForm?: {
    heading?: string
    description?: string
    nameLabel?: string
    emailLabel?: string
    messageLabel?: string
    submitButton?: string
    submittingText?: string
    successMessage?: string
    errorMessage?: string
  }
  studioInfo?: {
    heading?: string
    addressLabel?: string
    phoneLabel?: string
    emailLabel?: string
    hoursLabel?: string
    hoursText?: string
    googleMapsUrl?: string
    showMap?: boolean
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface SiteSettings {
  contactEmail?: string
  contactPhone?: string
  address?: {
    companyName?: string
    street?: string
    city?: string
    state?: string
    zip?: string
    googleMapsUrl?: string
  }
  businessHours?: string
}

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [pageData, setPageData] = useState<ContactPageData | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [contactData, settingsData] = await Promise.all([
          client.fetch(contactPageQuery),
          client.fetch(siteSettingsQuery)
        ])
        setPageData(contactData)
        setSiteSettings(settingsData)
      } catch (error) {
        console.error('Error fetching page data:', error)
      }
    }
    fetchPageData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        console.error('Form submission error:', data.error)
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white noise-overlay">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-black -z-10"></div>
        
        <div className="relative z-10 pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-16 fade-in-up">
          <h1 className="page-title">{pageData?.hero?.title || 'Contact Us'}</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            {pageData?.hero?.subtitle || "Let's Bring Your Creative Vision to Life"}
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="heading-font text-3xl font-semibold mb-6">{pageData?.contactForm?.heading || 'Get in Touch'}</h2>
            <p className="text-gray-400 mb-8">
              {pageData?.contactForm?.description || "Ready to bring your creative vision to life? We'd love to hear about your project. Fill out the form below and our team will get back to you within 24 hours."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {pageData?.contactForm?.nameLabel || 'Name'} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {pageData?.contactForm?.emailLabel || 'Email'} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {pageData?.contactForm?.messageLabel || 'Message'} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (pageData?.contactForm?.submittingText || 'Sending...') : (pageData?.contactForm?.submitButton || 'Send Message')}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-center">{pageData?.contactForm?.successMessage || 'Message sent successfully!'}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center">{pageData?.contactForm?.errorMessage || 'Something went wrong. Please try again.'}</p>
              )}
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="heading-font text-3xl font-semibold mb-6">{pageData?.studioInfo?.heading || 'Visit Our Studio'}</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.addressLabel || 'Address'}</h3>
                  <p className="text-gray-400">
                    {siteSettings?.address?.companyName && <>{siteSettings.address.companyName}<br /></>}
                    {siteSettings?.address?.street && <>{siteSettings.address.street}<br /></>}
                    {siteSettings?.address?.city && siteSettings?.address?.state && siteSettings?.address?.zip && (
                      <>{siteSettings.address.city}, {siteSettings.address.state} {siteSettings.address.zip}</>
                    )}
                  </p>
                </div>
                {siteSettings?.contactPhone && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.phoneLabel || 'Phone'}</h3>
                    <p className="text-gray-400">{siteSettings.contactPhone}</p>
                  </div>
                )}
                {siteSettings?.contactEmail && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.emailLabel || 'Email'}</h3>
                    <p className="text-gray-400">{siteSettings.contactEmail}</p>
                  </div>
                )}
                {(pageData?.studioInfo?.hoursText || siteSettings?.businessHours) && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.hoursLabel || 'Business Hours'}</h3>
                    <p className="text-gray-400 whitespace-pre-line">{pageData?.studioInfo?.hoursText || siteSettings?.businessHours}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Google Map */}
            {pageData?.studioInfo?.showMap !== false && (
              <div className="h-96 bg-zinc-900 rounded-lg overflow-hidden">
                <iframe
                  src={pageData?.studioInfo?.googleMapsUrl || siteSettings?.address?.googleMapsUrl || ""}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale"
                />
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage