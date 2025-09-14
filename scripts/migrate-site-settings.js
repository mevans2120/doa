const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
})

const siteSettingsData = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  title: 'Department of Art',
  description: 'Professional set construction services for the entertainment industry',
  
  // SEO & Meta Tags
  seo: {
    metaTitle: 'Department of Art',
    metaDescription: 'Professional set construction services for the entertainment industry',
    siteUrl: 'https://departmentofart.com',
    twitterCard: 'summary_large_image',
  },
  
  // Contact Information
  contactEmail: 'info@departmentofart.com',
  contactPhone: '(503) 555-0123',
  address: {
    companyName: 'Department of Art Productions',
    street: '6500 NE Portland Hwy',
    city: 'Portland',
    state: 'OR',
    zip: '97218',
    googleMapsUrl: 'https://maps.google.com/?q=6500+NE+Portland+Hwy+Portland+OR+97218',
  },
  
  // Footer Content
  footer: {
    companyDescription: 'Professional excellence in film & television set design, commercial productions, and custom prop building.',
    tagline: 'Build • Destroy',
    services: [
      'Film & Television Sets',
      'Commercial Productions', 
      'Custom Prop Building',
      'Design Consultation'
    ],
    copyrightText: '© {year} Department of Art. All rights reserved.',
  },
  
  // Navigation Labels
  navigation: {
    home: 'Home',
    projects: 'Our Work',
    services: 'What We Do',
    clients: 'Our Clients',
    about: 'About',
    contact: 'Contact',
  },
  
  // Social Media (empty for now, can be added later)
  socialMedia: {
    instagram: null,
    linkedin: null,
    vimeo: null,
    facebook: null,
    twitter: null,
  }
}

async function migrateSiteSettings() {
  try {
    console.log('Starting site settings migration...')
    
    // Check if document already exists
    const existing = await client.fetch(`*[_type == "siteSettings" && _id == "siteSettings"][0]`)
    
    if (existing) {
      console.log('Site settings already exist. Updating with new fields...')
      
      // Merge with existing data to preserve any fields already set
      const updatedData = {
        ...siteSettingsData,
        // Preserve existing hero content if it exists
        heroTitle: existing.heroTitle || siteSettingsData.heroTitle,
        heroSubtitle: existing.heroSubtitle || siteSettingsData.heroSubtitle,
      }
      
      const result = await client
        .patch('siteSettings')
        .set(updatedData)
        .commit()
      console.log('Site settings updated successfully!')
    } else {
      console.log('Creating new site settings...')
      const result = await client.create(siteSettingsData)
      console.log('Site settings created successfully!')
    }
    
    console.log('Migration completed successfully!')
    console.log('\nYou can now:')
    console.log('1. Edit all footer content in Sanity Studio')
    console.log('2. Update meta tags and SEO settings')
    console.log('3. Manage navigation labels')
    console.log('4. Add social media links when ready')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateSiteSettings()