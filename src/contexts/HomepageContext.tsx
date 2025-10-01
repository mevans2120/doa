'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { homepageSettingsQuery } from '../../sanity/lib/queries'

interface HomepageSettings {
  heroSection?: {
    mainTitle?: string
    subtitle?: string
    showLogo?: boolean
  }
  sectionTitles?: {
    featuredProjects?: string
    whatWeDo?: string
    ourClients?: string
    testimonials?: string
    aboutCTA?: string
  }
  aboutCTA?: {
    heading?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { _type: string; asset: { _ref: string; _type: string } }
  }
}

interface HomepageContextType {
  settings: HomepageSettings
  loading: boolean
}

const HomepageContext = createContext<HomepageContextType>({
  settings: {},
  loading: true,
})

export const useHomepage = () => useContext(HomepageContext)

export const HomepageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HomepageSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch<HomepageSettings>(homepageSettingsQuery)
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching homepage settings:', error)
        // No fallback values - CMS data only
        setSettings({})
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <HomepageContext.Provider value={{ settings, loading }}>
      {children}
    </HomepageContext.Provider>
  )
}