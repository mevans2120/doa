'use client'

import { useState, useEffect, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client } from '../../../sanity/lib/client'
import { contactPageQuery } from '../../../sanity/lib/queries'

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
    companyName?: string
    streetAddress?: string
    cityStateZip?: string
    phoneLabel?: string
    phoneNumber?: string
    emailLabel?: string
    emailAddress?: string
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

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [pageData, setPageData] = useState<ContactPageData | null>(null)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await client.fetch(contactPageQuery)
        setPageData(data)
      } catch (error) {
        console.error('Error fetching contact page data:', error)
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
                    {pageData?.studioInfo?.companyName || 'Department of Art Productions'}<br />
                    {pageData?.studioInfo?.streetAddress || '6500 NE Portland Hwy'}<br />
                    {pageData?.studioInfo?.cityStateZip || 'Portland, OR 97218'}
                  </p>
                </div>
                {pageData?.studioInfo?.phoneNumber && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.phoneLabel || 'Phone'}</h3>
                    <p className="text-gray-400">{pageData?.studioInfo?.phoneNumber}</p>
                  </div>
                )}
                {pageData?.studioInfo?.emailAddress && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.emailLabel || 'Email'}</h3>
                    <p className="text-gray-400">{pageData?.studioInfo?.emailAddress}</p>
                  </div>
                )}
                {pageData?.studioInfo?.hoursText && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 heading-font">{pageData?.studioInfo?.hoursLabel || 'Business Hours'}</h3>
                    <p className="text-gray-400 whitespace-pre-line">{pageData?.studioInfo?.hoursText}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Google Map */}
            {pageData?.studioInfo?.showMap !== false && (
              <div className="h-96 bg-zinc-900 rounded-lg overflow-hidden">
                <iframe
                  src={pageData?.studioInfo?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.0477544968!2d-122.59431668444!3d45.550666979102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495a72d8e7e9c5b%3A0x0!2s6500%20NE%20Portland%20Hwy%2C%20Portland%2C%20OR%2097218!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"}
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