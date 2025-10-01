import { http, HttpResponse } from 'msw'

// Mock Sanity API endpoints
export const handlers = [
  // Mock homepage settings endpoint
  http.get('https://:projectId.api.sanity.io/v2024-01-01/data/query/:dataset', ({ params, request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    
    // Mock response for homepage settings
    if (query?.includes('homepageSettings')) {
      return HttpResponse.json({
        result: {
          heroSection: {
            showLogo: true,
            subtitle: 'DEPARTMENT OF ART'
          },
          sectionTitles: {
            featuredProjects: 'FEATURED PROJECTS',
            whatWeDo: 'WHAT WE DO',
            ourClients: 'OUR CLIENTS',
            testimonials: 'CLIENT TESTIMONIALS'
          },
          aboutCTA: {
            heading: 'Building Dreams, One Set at a Time',
            description: 'With over 15 years of experience...',
            buttonText: 'Learn More About DOA',
            buttonLink: '/about'
          }
        }
      })
    }
    
    // Mock response for services
    if (query?.includes('service')) {
      return HttpResponse.json({
        result: [
          {
            _id: 'service-1',
            title: 'Set Construction',
            shortDescription: 'Expert set building services',
            iconType: 'building',
            order: 0,
            featured: true
          },
          {
            _id: 'service-2',
            title: 'Custom Welding',
            shortDescription: 'Professional welding and metal fabrication',
            iconType: 'tools',
            order: 1,
            featured: true
          }
        ]
      })
    }
    
    // Default response
    return HttpResponse.json({ result: [] })
  }),
]