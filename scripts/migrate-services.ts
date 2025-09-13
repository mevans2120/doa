import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vc89ievx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to your .env.local
  useCdn: false,
})

const services = [
  {
    title: 'Graphic Renderings',
    slug: { current: 'graphic-renderings' },
    shortDescription: 'Professional 3D renderings and visualizations that bring your concepts to life before construction begins.',
    iconType: 'brush',
    category: 'design',
    order: 0,
    featured: true,
  },
  {
    title: 'Set Construction',
    slug: { current: 'set-construction' },
    shortDescription: 'Expert set building services from concept to completion, creating immersive environments for any production.',
    iconType: 'building',
    category: 'production',
    order: 1,
    featured: true,
  },
  {
    title: 'Scenic Treatments',
    slug: { current: 'scenic-treatments' },
    shortDescription: 'Specialized scenic painting and finishing techniques that add authentic texture and atmosphere to your sets.',
    iconType: 'paint',
    category: 'production',
    order: 2,
    featured: true,
  },
  {
    title: 'Custom Welding',
    slug: { current: 'custom-welding' },
    shortDescription: 'Professional welding and metal fabrication for structural elements, custom frameworks, and artistic pieces.',
    iconType: 'tools',
    category: 'fabrication',
    order: 3,
    featured: true,
  },
  {
    title: 'Trade Show Displays',
    slug: { current: 'trade-show-displays' },
    shortDescription: 'Eye-catching trade show booths and displays that make your brand stand out.',
    iconType: 'display',
    category: 'specialty',
    order: 4,
    featured: false,
  },
  {
    title: 'Retail Fixtures',
    slug: { current: 'retail-fixtures' },
    shortDescription: 'Custom retail displays and fixtures that enhance your store environment.',
    iconType: 'cart',
    category: 'specialty',
    order: 5,
    featured: false,
  },
  {
    title: 'Crating Services',
    slug: { current: 'crating-services' },
    shortDescription: 'Professional crating and packaging solutions for safe transport of valuable sets and props.',
    iconType: 'box',
    category: 'specialty',
    order: 6,
    featured: false,
  },
  {
    title: 'Materials Handling Equipment',
    slug: { current: 'materials-handling-equipment' },
    shortDescription: 'Specialized equipment for moving and handling large set pieces and production materials.',
    iconType: 'truck',
    category: 'rentals',
    order: 7,
    featured: false,
  },
  {
    title: 'Art Department Crew',
    slug: { current: 'art-department-crew' },
    shortDescription: 'Experienced art department professionals for productions of any size.',
    iconType: 'users',
    category: 'production',
    order: 8,
    featured: false,
  },
  {
    title: 'Shop Rental',
    slug: { current: 'shop-rental' },
    shortDescription: 'Fully equipped workshop spaces available for rent with professional tools and loading docks.',
    iconType: 'warehouse',
    category: 'rentals',
    order: 9,
    featured: false,
  },
  {
    title: 'Office/Internet Rental',
    slug: { current: 'office-internet-rental' },
    shortDescription: 'Production office spaces with high-speed internet and meeting rooms.',
    iconType: 'globe',
    category: 'rentals',
    order: 10,
    featured: false,
  },
  {
    title: 'Truck Rental and Supplies',
    slug: { current: 'truck-rental-supplies' },
    shortDescription: 'Production vehicles and transportation solutions for equipment and materials.',
    iconType: 'truck',
    category: 'rentals',
    order: 11,
    featured: false,
  },
  {
    title: 'F/X Supplies and Rentals',
    slug: { current: 'fx-supplies-rentals' },
    shortDescription: 'Special effects equipment and supplies for creating memorable production moments.',
    iconType: 'lightning',
    category: 'specialty',
    order: 12,
    featured: false,
  },
]

async function migrateServices() {
  console.log('Starting service migration...')
  
  try {
    // First, delete existing services to avoid duplicates
    const existingServices = await client.fetch('*[_type == "service"]')
    
    if (existingServices.length > 0) {
      console.log(`Deleting ${existingServices.length} existing services...`)
      for (const service of existingServices) {
        await client.delete(service._id)
      }
    }
    
    // Create new services
    console.log(`Creating ${services.length} services...`)
    
    for (const service of services) {
      const doc = {
        _type: 'service',
        ...service,
      }
      
      const result = await client.create(doc)
      console.log(`Created service: ${result.title}`)
    }
    
    console.log('✅ Service migration completed successfully!')
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

// Run the migration
migrateServices()