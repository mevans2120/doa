import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { nanoid } from 'nanoid'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function fixGalleryKeys() {
  console.log('🔧 Fixing missing _key properties in gallery arrays...')
  
  try {
    // Fetch all projects with galleries
    const projects = await client.fetch(`*[_type == "project" && defined(gallery)]`)
    
    console.log(`Found ${projects.length} projects with galleries`)
    
    for (const project of projects) {
      if (project.gallery && Array.isArray(project.gallery)) {
        let needsUpdate = false
        const updatedGallery = project.gallery.map((item: any) => {
          if (!item._key) {
            needsUpdate = true
            return {
              ...item,
              _key: nanoid(12)
            }
          }
          return item
        })
        
        if (needsUpdate) {
          console.log(`Updating gallery keys for: ${project.title}`)
          await client
            .patch(project._id)
            .set({ gallery: updatedGallery })
            .commit()
          console.log(`✅ Fixed ${project.title}`)
        } else {
          console.log(`✓ ${project.title} already has keys`)
        }
      }
    }
    
    console.log('✨ All gallery keys have been fixed!')
  } catch (error) {
    console.error('Error fixing gallery keys:', error)
  }
}

fixGalleryKeys()