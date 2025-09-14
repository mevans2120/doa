import { render, screen, waitFor } from '@testing-library/react'
import Services from '@/components/Services'

// Import the mocked client
import { client } from '../../../src/__mocks__/sanity/lib/client'

// Mock the HomepageContext
jest.mock('@/contexts/HomepageContext', () => ({
  useHomepage: () => ({
    settings: {
      sectionTitles: {
        whatWeDo: 'WHAT WE DO'
      }
    },
    loading: false
  })
}))

// Mock ServiceIcons without JSX
jest.mock('@/components/ServiceIcons', () => ({
  ServiceIcons: {
    tools: 'Tools Icon',
    building: 'Building Icon',
    brush: 'Brush Icon',
    display: 'Display Icon',
    equipment: 'Equipment Icon',
    crew: 'Crew Icon',
  }
}))

describe('Services with CMS', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // The mock now returns real fixture data based on query
  })

  it('fetches and renders services from Sanity', async () => {
    // The mock now automatically returns real fixture data
    render(<Services />)
    
    // Check loading state is shown initially
    expect(screen.getByText('WHAT WE DO')).toBeInTheDocument()
    
    // Wait for real data to load and render
    await waitFor(() => {
      // These are the actual service titles from our Sanity data
      expect(screen.getByText('Trade Show Displays')).toBeInTheDocument()
      expect(screen.getByText('Materials Handling Equipment')).toBeInTheDocument()
    })
    
    // Verify fetch was called
    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining('*[_type == "service"]')
    )
  })

  it('handles empty state when no services exist', async () => {
    // Override the mock for this specific test
    ;(client.fetch as jest.Mock).mockResolvedValueOnce([])
    
    render(<Services />)
    
    await waitFor(() => {
      expect(screen.getByText(/No services available/i)).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    ;(client.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(<Services />)
    
    await waitFor(() => {
      expect(screen.getByText(/No services available/i)).toBeInTheDocument()
    })
  })

  it('filters featured services when limit prop is provided', async () => {
    render(<Services limit={4} />)
    
    await waitFor(() => {
      expect(client.fetch).toHaveBeenCalledWith(
        expect.stringContaining('featured == true')
      )
    })
  })

  it('shows View All CTA when limit is set and services exceed limit', async () => {
    // Set up some featured services for this test
    const featuredServices = Array(4).fill(null).map((_, i) => ({
      _id: `service-${i}`,
      title: `Service ${i}`,
      shortDescription: 'Description',
      featured: true,
      order: i,
      iconType: 'tools'
    }))
    ;(client.fetch as jest.Mock).mockResolvedValueOnce(featuredServices)
    
    render(<Services limit={4} />)
    
    await waitFor(() => {
      expect(screen.getByText('View All Services')).toBeInTheDocument()
    })
  })
})