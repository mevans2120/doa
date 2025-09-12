import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Initialize Sanity client
const client = createClient({
  projectId: 'vc89ievx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Image mappings for projects
const projectImages: { [key: string]: { main: string, gallery?: string[] } } = {
  'project-echoes-tomorrow': {
    main: '/doa-sample-1.jpeg',
    gallery: ['/doa-sample-1.jpeg', '/doa-sample-2.jpeg', '/doa-sample-3.png']
  },
  'project-last-station': {
    main: '/doa-sample-4.png',
    gallery: ['/doa-sample-4.png', '/doa-sample-5.jpeg']
  },
  'project-neon-nights': {
    main: '/doa-sample-6.jpeg',
    gallery: ['/doa-sample-6.jpeg', '/doa-sample-7.jpeg']
  },
  'project-broken-chains': {
    main: '/doa-sample-8.jpeg',
    gallery: ['/doa-sample-8.jpeg', '/doa-sample-9.jpeg']
  },
  'project-corporate-shadows': {
    main: '/doa-sample-10.jpeg',
    gallery: ['/doa-sample-10.jpeg', '/doa-sample-11.jpeg']
  },
  'project-portland-files': {
    main: '/doa-sample-12.jpeg',
    gallery: ['/doa-sample-12.jpeg', '/doa-sample-13.png']
  },
  'project-workshop-series': {
    main: '/doa-sample-14.jpeg',
    gallery: ['/doa-sample-14.jpeg']
  },
  'project-tech-innovation': {
    main: '/doa-sample-15.jpeg',
    gallery: ['/doa-sample-15.jpeg', '/doa-sample-16.jpeg']
  },
  'project-sustainable-future': {
    main: '/doa-sample-17.png',
    gallery: ['/doa-sample-17.png']
  },
  'project-fashion-week-2024': {
    main: '/doa-sample-18.jpeg',
    gallery: ['/doa-sample-18.jpeg', '/doa-sample-19.jpeg']
  },
  'project-tech-summit': {
    main: '/doa-sample-20.jpeg',
    gallery: ['/doa-sample-20.jpeg']
  }
}

// Client logo mappings
const clientLogos: { [key: string]: string } = {
  'client-netflix': '/Netflix_2015_logo.svg',
  'client-amazon': '/Amazon_logo.svg',
  'client-microsoft': '/Microsoft_logo_(2012).svg',
  'client-meta': '/Meta_Platforms_Inc._logo.svg',
  'client-nike': '/Logo_NIKE.svg',
  'client-adidas': '/Adidas_Logo.svg',
  'client-intel': '/Intel_logo_(2020,_light_blue).svg',
  'client-columbia': '/Columbia_Sportswear_Co_logo.svg',
  'client-spotify': '/Black_Spotify_logo_with_text.svg',
  'client-nintendo': '/Nintendo_logo.svg',
  'client-keen': '/keen-1.svg',
  'client-jeldwen': '/JELD-WEN-logo.svg',
}

// Team member photos
const teamPhotos: { [key: string]: string } = {
  'team-ben': '/Ben.jpeg',
  'team-chandler': '/Chandler.jpeg',
  'team-jeff': '/JEff.jpeg'
}

async function uploadImageToSanity(filePath: string): Promise<any> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      return null
    }

    // Read the file
    const imageBuffer = fs.readFileSync(fullPath)
    
    // Determine content type
    const ext = path.extname(filePath).toLowerCase()
    const contentType = 
      ext === '.svg' ? 'image/svg+xml' :
      ext === '.png' ? 'image/png' :
      ext === '.jpeg' || ext === '.jpg' ? 'image/jpeg' :
      'application/octet-stream'

    // Upload to Sanity
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(filePath),
      contentType
    })

    console.log(`✅ Uploaded: ${filePath}`)
    return asset
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error)
    return null
  }
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Sanity...\n')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN is not set')
    process.exit(1)
  }

  try {
    // Upload and update project images
    console.log('📸 Uploading project images...')
    for (const [projectId, images] of Object.entries(projectImages)) {
      console.log(`\nProcessing ${projectId}...`)
      
      // Upload main image
      const mainImageAsset = await uploadImageToSanity(images.main)
      
      // Upload gallery images
      const galleryAssets = []
      if (images.gallery) {
        for (const galleryImage of images.gallery) {
          const asset = await uploadImageToSanity(galleryImage)
          if (asset) {
            galleryAssets.push({
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            })
          }
        }
      }

      // Update the project document
      if (mainImageAsset || galleryAssets.length > 0) {
        const updates: any = {}
        
        if (mainImageAsset) {
          updates.mainImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: mainImageAsset._id
            }
          }
        }
        
        if (galleryAssets.length > 0) {
          updates.gallery = galleryAssets
        }

        await client.patch(projectId).set(updates).commit()
        console.log(`✅ Updated ${projectId} with images`)
      }
    }

    // Upload client logos
    console.log('\n📸 Uploading client logos...')
    for (const [clientId, logoPath] of Object.entries(clientLogos)) {
      console.log(`Processing ${clientId}...`)
      const logoAsset = await uploadImageToSanity(logoPath)
      
      if (logoAsset) {
        await client.patch(clientId).set({
          logo: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: logoAsset._id
            }
          },
          // For dark backgrounds, use the same logo (you can upload white versions separately if you have them)
          logoWhite: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: logoAsset._id
            }
          }
        }).commit()
        console.log(`✅ Updated ${clientId} with logo`)
      }
    }

    // Upload team member photos
    console.log('\n📸 Uploading team member photos...')
    for (const [memberId, photoPath] of Object.entries(teamPhotos)) {
      console.log(`Processing ${memberId}...`)
      const photoAsset = await uploadImageToSanity(photoPath)
      
      if (photoAsset) {
        await client.patch(memberId).set({
          photo: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: photoAsset._id
            }
          }
        }).commit()
        console.log(`✅ Updated ${memberId} with photo`)
      }
    }

    console.log('\n🎉 Image migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Refresh your website to see the images')
    console.log('2. Visit the Sanity Studio to manage images')
    console.log('3. You can now upload additional images directly in the Studio')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateImages()