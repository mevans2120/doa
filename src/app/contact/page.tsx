'use client'

import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

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
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative min-h-screen text-white">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-[#252525] to-gray-800 -z-10"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-6 display-font">Contact Us</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            Let&apos;s Bring Your Creative Vision to Life
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-semibold mb-6 display-font">Get in Touch</h2>
            <p className="text-gray-400 mb-8">
              Ready to bring your creative vision to life? We&apos;d love to hear about your project.
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
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
                  Email *
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
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="">Select a subject</option>
                  <option value="new-project">New Project Inquiry</option>
                  <option value="quote">Request for Quote</option>
                  <option value="general">General Information</option>
                  <option value="careers">Career Opportunities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
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
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-center">Message sent successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-semibold mb-6 display-font">Visit Our Studio</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Address</h3>
                  <p className="text-gray-400">
                    Department of Art Productions<br />
                    1234 NW Industrial Way<br />
                    Portland, OR 97210
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                  <p className="text-gray-400">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: By appointment only<br />
                    Sunday: Closed
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact</h3>
                  <p className="text-gray-400">
                    Phone: (503) 555-0123<br />
                    Email: info@doaproductions.com
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="h-96 bg-zinc-900 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.8806749915!2d-122.69169!3d45.5538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMzJzEzLjciTiAxMjLCsDQxJzMwLjEiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale"
              />
            </div>

            {/* Additional Info */}
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Production Inquiries</h3>
              <p className="text-gray-400 mb-4">
                For urgent production needs or after-hours support, please contact our 24/7 production hotline:
              </p>
              <p className="text-xl font-semibold">(503) 555-0911</p>
            </div>
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