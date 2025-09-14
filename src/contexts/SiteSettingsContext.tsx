'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { siteSettingsQuery } from '../../sanity/lib/queries'

interface SiteSettings {
  title?: string
  description?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    siteUrl?: string
    socialImage?: { _type: string; asset: { _ref: string; _type: string } }
    twitterCard?: string
  }
  heroTitle?: string
  heroSubtitle?: string
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
  footer?: {
    companyDescription?: string
    tagline?: string
    services?: string[]
    copyrightText?: string
  }
  navigation?: {
    home?: string
    projects?: string
    services?: string
    clients?: string
    about?: string
    contact?: string
  }
  socialMedia?: {
    instagram?: string
    linkedin?: string
    vimeo?: string
    facebook?: string
    twitter?: string
  }
}

interface SiteSettingsContextType {
  settings: SiteSettings
  loading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: {},
  loading: true,
})

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch<SiteSettings>(siteSettingsQuery)
        setSettings(data || {})
      } catch (error) {
        console.error('Error fetching site settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return context
}