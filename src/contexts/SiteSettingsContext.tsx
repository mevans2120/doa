'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { siteSettingsQuery } from '../../sanity/lib/queries'
import { toPlainText } from '@portabletext/toolkit'
import type { TypedObject } from '@portabletext/types'

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

  // Helper function to convert Portable Text to plain string
  const toPlainString = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (Array.isArray(value)) {
      try {
        return toPlainText(value as TypedObject[])
      } catch {
        return ''
      }
    }
    return ''
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch<SiteSettings>(siteSettingsQuery)

        // Convert any Portable Text fields to plain strings
        const sanitizedData = data ? {
          ...data,
          businessHours: toPlainString(data.businessHours),
          footer: data.footer ? {
            ...data.footer,
            companyDescription: toPlainString(data.footer.companyDescription),
            tagline: toPlainString(data.footer.tagline),
            copyrightText: toPlainString(data.footer.copyrightText),
          } : undefined
        } : {}

        setSettings(sanitizedData)
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