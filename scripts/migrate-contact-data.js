/**
 * Migration script to consolidate contact information
 * Moves contact data from contactPage to siteSettings
 *
 * Usage: node scripts/migrate-contact-data.js
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Need write access
  useCdn: false,
})

async function migrateContactData() {
  console.log('Starting contact data migration...')

  try {
    // Fetch existing contact page data
    const contactPage = await client.fetch(`*[_type == "contactPage"][0]`)

    if (!contactPage) {
      console.log('No contact page data found.')
      return
    }

    // Fetch existing site settings
    const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]`)

    if (!siteSettings) {
      console.log('No site settings found. Please create site settings first.')
      return
    }

    // Check if migration is needed
    const needsMigration = contactPage.studioInfo && (
      contactPage.studioInfo.companyName ||
      contactPage.studioInfo.streetAddress ||
      contactPage.studioInfo.cityStateZip ||
      contactPage.studioInfo.phoneNumber ||
      contactPage.studioInfo.emailAddress
    )

    if (!needsMigration) {
      console.log('No migration needed - contact page already updated.')
      return
    }

    console.log('Found contact data to migrate:')
    console.log('- Company:', contactPage.studioInfo.companyName)
    console.log('- Address:', contactPage.studioInfo.streetAddress)
    console.log('- City/State/ZIP:', contactPage.studioInfo.cityStateZip)
    console.log('- Phone:', contactPage.studioInfo.phoneNumber)
    console.log('- Email:', contactPage.studioInfo.emailAddress)

    // Prepare updates for site settings
    const updates = {}

    // Only update if site settings don't already have values
    if (!siteSettings.address?.companyName && contactPage.studioInfo.companyName) {
      updates['address.companyName'] = contactPage.studioInfo.companyName
    }

    if (!siteSettings.address?.street && contactPage.studioInfo.streetAddress) {
      updates['address.street'] = contactPage.studioInfo.streetAddress
    }

    // Parse city, state, zip from combined field
    if (!siteSettings.address?.city && contactPage.studioInfo.cityStateZip) {
      const match = contactPage.studioInfo.cityStateZip.match(/^(.+),\s*([A-Z]{2})\s*(\d{5})$/)
      if (match) {
        if (!siteSettings.address?.city) updates['address.city'] = match[1]
        if (!siteSettings.address?.state) updates['address.state'] = match[2]
        if (!siteSettings.address?.zip) updates['address.zip'] = match[3]
      }
    }

    if (!siteSettings.contactPhone && contactPage.studioInfo.phoneNumber) {
      updates.contactPhone = contactPage.studioInfo.phoneNumber
    }

    if (!siteSettings.contactEmail && contactPage.studioInfo.emailAddress) {
      updates.contactEmail = contactPage.studioInfo.emailAddress
    }

    // Move business hours if not already in site settings
    if (!siteSettings.businessHours && contactPage.studioInfo.hoursText) {
      updates.businessHours = contactPage.studioInfo.hoursText
    }

    // Move Google Maps URL if not already in site settings
    if (!siteSettings.address?.googleMapsUrl && contactPage.studioInfo.googleMapsUrl) {
      updates['address.googleMapsUrl'] = contactPage.studioInfo.googleMapsUrl
    }

    if (Object.keys(updates).length === 0) {
      console.log('Site settings already has all contact information.')
      return
    }

    console.log('\nUpdating site settings with:', updates)

    // Update site settings
    await client
      .patch(siteSettings._id)
      .set(updates)
      .commit()

    console.log('✅ Site settings updated successfully!')

    // Now remove the duplicate fields from contact page
    console.log('\nRemoving duplicate fields from contact page...')

    const contactPageUnsets = [
      'studioInfo.companyName',
      'studioInfo.streetAddress',
      'studioInfo.cityStateZip',
      'studioInfo.phoneNumber',
      'studioInfo.emailAddress',
    ]

    await client
      .patch(contactPage._id)
      .unset(contactPageUnsets)
      .commit()

    console.log('✅ Contact page cleaned up successfully!')
    console.log('\nMigration complete! Contact information is now centralized in Site Settings.')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateContactData()