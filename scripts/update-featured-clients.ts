import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function updateFeaturedClients() {
  try {
    // Fetch all featured clients
    const featuredClients = await client.fetch(`*[_type == "client" && featured == true]`)

    console.log(`Found ${featuredClients.length} featured clients to update`)

    // Update each featured client to also have featuredOnHomepage = true
    for (const clientDoc of featuredClients) {
      console.log(`Updating ${clientDoc.name}...`)

      await client
        .patch(clientDoc._id)
        .set({ featuredOnHomepage: true })
        .commit()
    }

    console.log('✅ All featured clients have been updated with featuredOnHomepage = true')

    // Verify the update
    const updatedClients = await client.fetch(`*[_type == "client" && featuredOnHomepage == true] {name}`)
    console.log(`\nClients now featured on homepage (${updatedClients.length}):`)
    updatedClients.forEach((c: any) => console.log(`  - ${c.name}`))

  } catch (error) {
    console.error('Error updating clients:', error)
    process.exit(1)
  }
}

updateFeaturedClients()