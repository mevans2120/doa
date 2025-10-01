import { createClient } from '@sanity/client'
import { nanoid } from 'nanoid'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Initialize Sanity client for migration
const client = createClient({
  projectId: 'vc89ievx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Projects data from Projects component and projects page
const projects = [
  // Feature Films
  {
    _type: 'project',
    _id: 'project-echoes-tomorrow',
    title: "Echoes of Tomorrow",
    slug: { current: 'echoes-tomorrow' },
    category: "Film Production",
    type: "Dystopian Sci-Fi Feature",
    description: "Transformed 20,000 sq ft warehouse into a sprawling dystopian cityscape featuring practical weather effects, modular building facades, and fully-functional infrastructure. Collaborated with Oscar-nominated production designer Sarah Chen to create a believable post-climate-disaster Portland.",
    client: "Paramount Pictures",
    year: 2024,
    featured: true,
    credits: {
      director: "Michael Rodriguez",
      productionDesigner: "Sarah Chen",
      cinematographer: "Lisa Park"
    },
    technicalDetails: {
      squareFeet: 20000,
      buildDuration: "12 weeks",
      specialFeatures: ["Rain towers", "Modular facades", "Practical debris effects"]
    },
    order: 1
  },
  {
    _type: 'project',
    _id: 'project-last-station',
    title: "The Last Station",
    slug: { current: 'last-station' },
    category: "Film Production",
    type: "Post-Apocalyptic Drama",
    description: "Constructed an abandoned subway station complete with decaying infrastructure, atmospheric lighting rigs, and period-accurate signage. The build included functional track sections and a full-scale train car interior designed for 360-degree filming.",
    client: "A24 Films",
    year: 2024,
    featured: true,
    technicalDetails: {
      squareFeet: 15000,
      buildDuration: "10 weeks",
      specialFeatures: ["Functional track system", "Atmospheric effects", "Period signage"]
    },
    order: 2
  },
  {
    _type: 'project',
    _id: 'project-neon-nights',
    title: "Neon Nights",
    slug: { current: 'neon-nights' },
    category: "Film Production",
    type: "Cyberpunk Action",
    description: "Built a three-story cyberpunk marketplace with integrated LED displays, practical neon signage, and modular vendor stalls. Features included rain-slicked surfaces, steam effects, and breakaway elements for stunt sequences.",
    client: "Warner Bros.",
    year: 2023,
    featured: true,
    credits: {
      director: "Akira Tanaka",
      productionDesigner: "Marcus Webb"
    },
    technicalDetails: {
      squareFeet: 25000,
      buildDuration: "14 weeks",
      specialFeatures: ["LED integration", "Breakaway elements", "Water effects"]
    },
    order: 3
  },
  {
    _type: 'project',
    _id: 'project-broken-chains',
    title: "Broken Chains",
    slug: { current: 'broken-chains' },
    category: "Film Production",
    type: "Historical Epic",
    description: "Recreated 1860s plantation grounds including main house facade, slave quarters, and cotton processing facilities. Meticulous historical research ensured authenticity while incorporating modern safety standards and filming requirements.",
    client: "Focus Features",
    year: 2023,
    credits: {
      director: "Angela Washington",
      productionDesigner: "Robert Hayes"
    },
    technicalDetails: {
      squareFeet: 30000,
      buildDuration: "16 weeks",
      specialFeatures: ["Historical accuracy", "Period materials", "Aged finishes"]
    },
    order: 4
  },
  // Television Series
  {
    _type: 'project',
    _id: 'project-corporate-shadows',
    title: "Corporate Shadows",
    slug: { current: 'corporate-shadows' },
    category: "Television Series",
    type: "Business Thriller",
    description: "Designed and built a modern corporate headquarters spanning two sound stages. Features include a boardroom with panoramic city views (LED wall integration), executive offices, and a multi-level atrium with practical elevator.",
    client: "HBO",
    year: 2024,
    featured: false,
    credits: {
      productionDesigner: "Elena Volkov"
    },
    technicalDetails: {
      squareFeet: 18000,
      buildDuration: "8 weeks",
      specialFeatures: ["LED wall integration", "Practical elevator", "Modular offices"]
    },
    order: 5
  },
  {
    _type: 'project',
    _id: 'project-portland-files',
    title: "Portland Files",
    slug: { current: 'portland-files' },
    category: "Television Series",
    type: "Crime Procedural",
    description: "Created a working police precinct including interrogation rooms with two-way mirrors, evidence lockup, and bullpen area. Designed for quick redressing to serve as multiple Portland locations throughout the series.",
    client: "Netflix",
    year: 2023,
    featured: false,
    technicalDetails: {
      squareFeet: 12000,
      buildDuration: "6 weeks",
      specialFeatures: ["Two-way mirrors", "Modular design", "Quick-change elements"]
    },
    order: 6
  },
  {
    _type: 'project',
    _id: 'project-workshop-series',
    title: "The Workshop",
    slug: { current: 'workshop' },
    category: "Television Series",
    type: "Artisan Documentary",
    description: "Built multiple artisan workshops including a traditional blacksmith forge, woodworking studio, and glass-blowing facility. Each space was fully functional for on-camera demonstrations while meeting all safety requirements.",
    client: "Discovery+",
    year: 2023,
    featured: false,
    technicalDetails: {
      squareFeet: 10000,
      buildDuration: "5 weeks",
      specialFeatures: ["Functional workshops", "Safety compliance", "Authentic tools"]
    },
    order: 7
  },
  // Commercial Productions
  {
    _type: 'project',
    _id: 'project-tech-innovation',
    title: "Tech Innovation Campaign",
    slug: { current: 'tech-innovation' },
    category: "Commercial Production",
    type: "Brand Campaign",
    description: "Constructed a futuristic smart home environment featuring hidden automation, seamless surfaces, and integrated projection mapping zones. The modular design allowed for rapid configuration changes between shots.",
    client: "Apple",
    year: 2024,
    featured: true,
    technicalDetails: {
      squareFeet: 5000,
      buildDuration: "2 weeks",
      specialFeatures: ["Projection mapping", "Hidden automation", "Modular design"]
    },
    order: 8
  },
  {
    _type: 'project',
    _id: 'project-sustainable-future',
    title: "Sustainable Future",
    slug: { current: 'sustainable-future' },
    category: "Commercial Production",
    type: "Environmental Campaign",
    description: "Created an eco-friendly living space using reclaimed materials and living walls. The build showcased sustainable construction techniques while maintaining high production values for automotive brand sustainability campaign.",
    client: "Tesla",
    year: 2023,
    featured: false,
    technicalDetails: {
      squareFeet: 3500,
      buildDuration: "10 days",
      specialFeatures: ["Living walls", "Reclaimed materials", "Solar integration"]
    },
    order: 9
  },
  // Live Events
  {
    _type: 'project',
    _id: 'project-fashion-week-2024',
    title: "Portland Fashion Week 2024",
    slug: { current: 'portland-fashion-week-2024' },
    category: "Live Events",
    type: "Fashion Show",
    description: "Designed and constructed a 120-foot modular runway with integrated lighting and projection mapping capabilities. The design featured a transformable backdrop system allowing for rapid scene changes between shows.",
    client: "Portland Fashion Council",
    year: 2024,
    featured: false,
    technicalDetails: {
      squareFeet: 15000,
      buildDuration: "5 days",
      specialFeatures: ["Modular runway", "Projection mapping", "Quick-change backdrops"]
    },
    order: 10
  },
  {
    _type: 'project',
    _id: 'project-tech-summit',
    title: "Northwest Tech Summit",
    slug: { current: 'northwest-tech-summit' },
    category: "Live Events",
    type: "Corporate Conference",
    description: "Built a multi-zone conference environment including main stage, breakout rooms, and interactive demo areas. Featured custom-built tech installations and seamless AV integration throughout.",
    client: "Portland Tech Association",
    year: 2023,
    featured: false,
    technicalDetails: {
      squareFeet: 25000,
      buildDuration: "1 week",
      specialFeatures: ["Interactive installations", "AV integration", "Modular zones"]
    },
    order: 11
  }
]

// Clients data
const clients = [
  { _type: 'client', _id: 'client-netflix', name: 'Netflix', featured: true, order: 1 },
  { _type: 'client', _id: 'client-amazon', name: 'Amazon Studios', featured: true, order: 2 },
  { _type: 'client', _id: 'client-microsoft', name: 'Microsoft Studios', featured: true, order: 3 },
  { _type: 'client', _id: 'client-meta', name: 'Meta Productions', featured: true, order: 4 },
  { _type: 'client', _id: 'client-nike', name: 'Nike Films', featured: true, order: 5 },
  { _type: 'client', _id: 'client-adidas', name: 'Adidas Media', featured: true, order: 6 },
  { _type: 'client', _id: 'client-intel', name: 'Intel Studios', featured: true, order: 7 },
  { _type: 'client', _id: 'client-columbia', name: 'Columbia Pictures', featured: true, order: 8 },
  { _type: 'client', _id: 'client-spotify', name: 'Spotify Originals', featured: true, order: 9 },
  { _type: 'client', _id: 'client-nintendo', name: 'Nintendo Pictures', featured: true, order: 10 },
  { _type: 'client', _id: 'client-keen', name: 'Keen Productions', featured: true, order: 11 },
  { _type: 'client', _id: 'client-jeldwen', name: 'JELD-WEN Media', featured: true, order: 12 },
]

// Collaborators (additional clients)
const collaborators = [
  { _type: 'client', _id: 'client-happylucky', name: 'HAPPYLUCKY INC', featured: false, order: 13 },
  { _type: 'client', _id: 'client-anonymous', name: 'ANONYMOUS CONTENT', featured: false, order: 14 },
  { _type: 'client', _id: 'client-r2c', name: 'R2C GROUP', featured: false, order: 15 },
  { _type: 'client', _id: 'client-weiden', name: 'WEIDEN AND KENNEDY', featured: false, order: 16 },
  { _type: 'client', _id: 'client-cmd', name: 'C.M.D.', featured: false, order: 17 },
  { _type: 'client', _id: 'client-bob', name: 'BOB INDUSTRIES', featured: false, order: 18 },
  { _type: 'client', _id: 'client-house', name: 'HOUSE SPECIAL', featured: false, order: 19 },
  { _type: 'client', _id: 'client-cbs', name: 'CB&S', featured: false, order: 20 },
  { _type: 'client', _id: 'client-mjz', name: 'MJZ', featured: false, order: 21 },
  { _type: 'client', _id: 'client-farm', name: 'FARM LEAGUE', featured: false, order: 22 },
  { _type: 'client', _id: 'client-kamp', name: 'KAMP GRIZZLY', featured: false, order: 23 },
  { _type: 'client', _id: 'client-uber', name: 'UBER CONTENT', featured: false, order: 24 },
  { _type: 'client', _id: 'client-rwest', name: 'R/WEST', featured: false, order: 25 },
  { _type: 'client', _id: 'client-sockeye', name: 'SOCKEYE', featured: false, order: 26 },
  { _type: 'client', _id: 'client-revery', name: 'REVERY', featured: false, order: 27 },
  { _type: 'client', _id: 'client-north', name: 'NORTH', featured: false, order: 28 },
  { _type: 'client', _id: 'client-afterall', name: 'AFTER ALL', featured: false, order: 29 },
  { _type: 'client', _id: 'client-foodchain', name: 'FOODCHAIN FILMS', featured: false, order: 30 },
]

// Testimonials data
const testimonials = [
  {
    _type: 'testimonial',
    _id: 'testimonial-1',
    quote: "DOA's attention to detail and creative problem-solving transformed our vision into reality. Their team built an entire dystopian city block that looked absolutely authentic on camera.",
    author: "Sarah Chen",
    role: "Production Designer",
    company: "Paramount Pictures",
    featured: true,
    order: 1
  },
  {
    _type: 'testimonial',
    _id: 'testimonial-2',
    quote: "Working with Department of Art was a game-changer for our production. They delivered beyond our expectations, on time and within budget.",
    author: "Michael Rodriguez",
    role: "Director",
    company: "Netflix",
    featured: true,
    order: 2
  },
  {
    _type: 'testimonial',
    _id: 'testimonial-3',
    quote: "The team at DOA brings an unmatched level of professionalism and creativity. They're our go-to for any production design needs in the Pacific Northwest.",
    author: "Lisa Park",
    role: "Executive Producer",
    company: "A24 Films",
    featured: true,
    order: 3
  }
]

// Team Members data
const teamMembers = [
  {
    _type: 'teamMember',
    _id: 'team-ben',
    name: 'Ben Haden',
    role: 'Founder & Creative Director',
    bio: 'With over 20 years in production design, Ben brings a unique blend of artistic vision and technical expertise to every project.',
    imdbUrl: 'https://www.imdb.com/name/nm0370715/?ref_=nv_sr_2',
    order: 1
  },
  {
    _type: 'teamMember',
    _id: 'team-chandler',
    name: 'Chandler Vinar',
    role: 'Head of Production',
    bio: 'Chandler oversees all production logistics, ensuring projects are delivered on time and within budget while maintaining the highest quality standards.',
    imdbUrl: 'https://www.imdb.com/name/nm0898506/?ref_=nv_sr_1',
    order: 2
  },
  {
    _type: 'teamMember',
    _id: 'team-jeff',
    name: 'Jeff Johnson',
    role: 'Technical Director',
    bio: 'Jeff leads our fabrication and technical teams, specializing in innovative construction techniques and visual effects integration.',
    imdbUrl: 'https://www.imdb.com/name/nm3764086/?ref_=nv_sr_1',
    order: 3
  }
]

// Services data
const services = [
  {
    _type: 'service',
    _id: 'service-set-construction',
    title: 'Set Construction',
    slug: { current: 'set-construction' },
    shortDescription: 'Full-scale set builds from concept to completion, including modular and permanent structures.',
    order: 1
  },
  {
    _type: 'service',
    _id: 'service-prop-building',
    title: 'Custom Prop Building',
    slug: { current: 'custom-prop-building' },
    shortDescription: 'Bespoke prop fabrication for hero props, practical effects, and specialized set pieces.',
    order: 2
  },
  {
    _type: 'service',
    _id: 'service-graphics',
    title: 'Graphics & Scenic Treatments',
    slug: { current: 'graphics-scenic-treatments' },
    shortDescription: 'Signage, weathering, aging, and specialty finishes to bring authenticity to every surface.',
    order: 3
  },
  {
    _type: 'service',
    _id: 'service-production-design',
    title: 'Production Design',
    slug: { current: 'production-design' },
    shortDescription: 'Complete production design services from initial concept through final execution.',
    order: 4
  },
  {
    _type: 'service',
    _id: 'service-art-direction',
    title: 'Art Direction',
    slug: { current: 'art-direction' },
    shortDescription: 'Creative direction and management for all visual aspects of your production.',
    order: 5
  },
  {
    _type: 'service',
    _id: 'service-retail-fixtures',
    title: 'Retail Fixtures',
    slug: { current: 'retail-fixtures' },
    shortDescription: 'Custom retail displays and fixtures for brands and commercial spaces.',
    order: 6
  }
]

// Site Settings
const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  title: 'Department of Art Productions',
  description: "Portland's premier production design company, transforming creative visions into cinematic reality since 2008.",
  heroTitle: 'Department of Art',
  heroSubtitle: 'Portland\'s premier production design company, transforming creative visions into cinematic reality.',
  contactEmail: 'info@departmentofart.com',
  contactPhone: '(503) 555-0100',
  address: '6500 NE Portland Hwy\nPortland, OR 97218',
  socialMedia: {
    instagram: 'https://instagram.com/departmentofart',
    linkedin: 'https://linkedin.com/company/department-of-art',
    vimeo: 'https://vimeo.com/departmentofart'
  }
}

// Migration function
async function migrate() {
  console.log('Starting migration to Sanity...')
  
  try {
    // Check if we have an API token
    if (!process.env.SANITY_API_TOKEN) {
      console.error('❌ Error: SANITY_API_TOKEN is not set in .env.local')
      console.log('\n📝 To get an API token:')
      console.log('1. Go to https://www.sanity.io/manage/project/vc89ievx/api')
      console.log('2. Click "Add API token"')
      console.log('3. Name it "Migration Token"')
      console.log('4. Select "Editor" permissions')
      console.log('5. Copy the token and add it to .env.local as SANITY_API_TOKEN=your_token_here')
      process.exit(1)
    }

    // Create all documents
    const allDocuments = [
      ...projects,
      ...clients,
      ...collaborators,
      ...testimonials,
      ...teamMembers,
      ...services,
      siteSettings
    ]

    console.log(`\n📦 Preparing to migrate ${allDocuments.length} documents...`)

    // Create documents in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < allDocuments.length; i += batchSize) {
      const batch = allDocuments.slice(i, i + batchSize)
      
      const transaction = client.transaction()
      batch.forEach(doc => {
        transaction.createOrReplace(doc)
      })
      
      await transaction.commit()
      console.log(`✅ Migrated ${Math.min(i + batchSize, allDocuments.length)} of ${allDocuments.length} documents`)
    }

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Run "npm run dev" to start your development server')
    console.log('2. Visit http://localhost:3000/studio to see your content in Sanity Studio')
    console.log('3. Upload images for projects, clients, and team members in the Studio')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrate()