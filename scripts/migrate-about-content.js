const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
})

const aboutPageContent = {
  _type: 'aboutPage',
  _id: 'aboutPage',
  title: 'About DOA',
  tagline: "Department of Art Productions is Portland's premier production design company, transforming creative visions into cinematic reality since 2008.",
  heroTitle: "Portland's film & photo beating heart",
  companyOverview: [
    {
      _type: 'block',
      _key: 'block1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'Department of Art is a full service scenery shop, supporting the local film/photo community for the last 20 years. Set construction, custom prop building, graphics and scenic treatments are just some of the services we offer.',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'block2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span2',
          text: 'DOA also fabricates retail fixtures, professional trade show displays, and provides services for special events and product launches.',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'block3',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span3',
          text: 'The three partners at Department of Art are all 20+ year veterans in the film industry, having filled every role from production designer, art director, prop master, decorator, lead man, and set dresser. All partners still actively work in the industry thus, DOA can be seen as "one stop shopping" for productions seeking all things art department. We can provide crew for your shoot, a place for that crew to work, provide internet and office needs, gated parking, and trucking for any size production. And when you\'re done for the day... enjoy a cold beer in our bar and a game of pinball.',
          marks: []
        }
      ],
      markDefs: []
    }
  ],
  missionTitle: 'Our Mission',
  missionText: 'To deliver exceptional production design services that bring creative visions to life, while fostering innovation, sustainability, and artistic excellence in everything we do.',
  visionTitle: 'Our Vision',
  visionText: "To be the Pacific Northwest's most trusted production design partner, known for our creativity, reliability, and commitment to pushing the boundaries of what's possible in visual storytelling.",
  teamSectionTitle: 'Leadership Team',
  seo: {
    metaTitle: 'About DOA - Department of Art Productions | Portland Production Design',
    metaDescription: 'Learn about Department of Art Productions, Portland\'s premier production design company. Full service scenery shop supporting film and photo productions since 2008.'
  }
}

async function migrateAboutContent() {
  try {
    console.log('Starting About page content migration...')
    
    // Check if document already exists
    const existing = await client.fetch(`*[_type == "aboutPage" && _id == "aboutPage"][0]`)
    
    if (existing) {
      console.log('About page content already exists. Updating...')
      const result = await client
        .patch('aboutPage')
        .set(aboutPageContent)
        .commit()
      console.log('About page content updated successfully!')
    } else {
      console.log('Creating new About page content...')
      const result = await client.create(aboutPageContent)
      console.log('About page content created successfully!')
    }
    
    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateAboutContent()