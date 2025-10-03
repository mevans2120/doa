/**
 * Script to add alt text to images in Sanity CMS
 * Run with: npx tsx scripts/add-image-alt-text.ts
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface ImageUpdate {
  documentId: string
  documentType: string
  fieldPath: string
  currentAlt?: string
  suggestedAlt: string
  context: string
}

async function addAltTextToImages() {
  console.log('🔍 Scanning for images without alt text...\n')

  const updates: ImageUpdate[] = []

  // Fetch all projects
  const projects = await client.fetch(`
    *[_type == "project"] {
      _id,
      title,
      client,
      mainImage {
        ...,
        alt,
        asset->{_id, url}
      },
      gallery[] {
        ...,
        alt,
        asset->{_id, url}
      }
    }
  `)

  console.log(`Found ${projects.length} projects`)

  // Check project main images
  for (const project of projects) {
    if (project.mainImage?.asset && !project.mainImage.alt) {
      const suggestedAlt = project.client
        ? `${project.title} - ${project.client} project showcase`
        : `${project.title} project showcase`

      updates.push({
        documentId: project._id,
        documentType: 'project',
        fieldPath: 'mainImage.alt',
        suggestedAlt,
        context: `Project: ${project.title}`,
      })
    }

    // Check gallery images
    if (project.gallery && Array.isArray(project.gallery)) {
      project.gallery.forEach((image: any, index: number) => {
        if (image?.asset && !image.alt) {
          const suggestedAlt = `${project.title} - Gallery image ${index + 1}`

          updates.push({
            documentId: project._id,
            documentType: 'project',
            fieldPath: `gallery[${index}].alt`,
            suggestedAlt,
            context: `Project: ${project.title} (Gallery ${index + 1})`,
          })
        }
      })
    }
  }

  // Fetch all team members
  const teamMembers = await client.fetch(`
    *[_type == "teamMember"] {
      _id,
      name,
      role,
      photo {
        ...,
        alt,
        asset->{_id, url}
      }
    }
  `)

  console.log(`Found ${teamMembers.length} team members`)

  for (const member of teamMembers) {
    if (member.photo?.asset && !member.photo.alt) {
      const suggestedAlt = member.role
        ? `${member.name}, ${member.role}`
        : `${member.name} - Team member`

      updates.push({
        documentId: member._id,
        documentType: 'teamMember',
        fieldPath: 'photo.alt',
        suggestedAlt,
        context: `Team: ${member.name}`,
      })
    }
  }

  // Fetch all clients
  const clients = await client.fetch(`
    *[_type == "client"] {
      _id,
      name,
      logo {
        ...,
        alt,
        asset->{_id, url}
      },
      logoWhite {
        ...,
        alt,
        asset->{_id, url}
      }
    }
  `)

  console.log(`Found ${clients.length} clients`)

  for (const client of clients) {
    if (client.logo?.asset && !client.logo.alt) {
      updates.push({
        documentId: client._id,
        documentType: 'client',
        fieldPath: 'logo.alt',
        suggestedAlt: `${client.name} logo`,
        context: `Client: ${client.name}`,
      })
    }

    if (client.logoWhite?.asset && !client.logoWhite.alt) {
      updates.push({
        documentId: client._id,
        documentType: 'client',
        fieldPath: 'logoWhite.alt',
        suggestedAlt: `${client.name} logo (white version)`,
        context: `Client: ${client.name} (white)`,
      })
    }
  }

  // Fetch about page
  const aboutPage = await client.fetch(`
    *[_type == "aboutPage"][0] {
      _id,
      companyImage {
        ...,
        alt,
        asset->{_id, url}
      },
      storyImage {
        ...,
        alt,
        asset->{_id, url}
      }
    }
  `)

  if (aboutPage) {
    console.log('Found about page')

    if (aboutPage.companyImage?.asset && !aboutPage.companyImage.alt) {
      updates.push({
        documentId: aboutPage._id,
        documentType: 'aboutPage',
        fieldPath: 'companyImage.alt',
        suggestedAlt: 'Department of Art company overview',
        context: 'About page - Company image',
      })
    }

    if (aboutPage.storyImage?.asset && !aboutPage.storyImage.alt) {
      updates.push({
        documentId: aboutPage._id,
        documentType: 'aboutPage',
        fieldPath: 'storyImage.alt',
        suggestedAlt: 'Department of Art story and history',
        context: 'About page - Story image',
      })
    }
  }

  console.log(`\n📊 Found ${updates.length} images without alt text\n`)

  if (updates.length === 0) {
    console.log('✅ All images already have alt text!')
    return
  }

  // Display proposed updates
  console.log('Proposed alt text updates:\n')
  updates.forEach((update, index) => {
    console.log(`${index + 1}. ${update.context}`)
    console.log(`   Field: ${update.fieldPath}`)
    console.log(`   Alt text: "${update.suggestedAlt}"`)
    console.log('')
  })

  // Apply updates
  console.log('🔄 Applying updates...\n')

  for (const update of updates) {
    try {
      // For gallery images, we need to fetch the current array and update it
      if (update.fieldPath.includes('gallery')) {
        const doc = await client.getDocument(update.documentId)
        const galleryIndex = parseInt(update.fieldPath.match(/\[(\d+)\]/)?.[1] || '0')

        if (doc.gallery && doc.gallery[galleryIndex]) {
          doc.gallery[galleryIndex].alt = update.suggestedAlt

          await client
            .patch(update.documentId)
            .set({ gallery: doc.gallery })
            .commit()

          console.log(`✅ Updated: ${update.context}`)
        }
      } else {
        // For other fields, use simple patch
        await client
          .patch(update.documentId)
          .set({ [update.fieldPath]: update.suggestedAlt })
          .commit()

        console.log(`✅ Updated: ${update.context}`)
      }
    } catch (error) {
      console.error(`❌ Failed to update ${update.context}:`, error)
    }
  }

  console.log(`\n✨ Successfully added alt text to ${updates.length} images!`)
}

// Run the script
addAltTextToImages()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
