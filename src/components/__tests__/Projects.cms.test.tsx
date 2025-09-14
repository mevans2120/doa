import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Projects from '@/components/Projects'

// Import the mocked client
import { client } from '../../../src/__mocks__/sanity/lib/client'

// Mock the Sanity image module
jest.mock('../../../sanity/lib/image', () => ({
  urlFor: jest.fn(() => ({
    width: jest.fn(() => ({
      height: jest.fn(() => ({
        url: jest.fn(() => 'https://test-image.com/image.jpg')
      }))
    }))
  }))
}))

// Mock the queries
jest.mock('../../../sanity/lib/queries', () => ({
  featuredProjectsQuery: '*[_type == "project" && featured == true] | order(year desc) [0...6]'
}))

// Mock the HomepageContext
jest.mock('@/contexts/HomepageContext', () => ({
  useHomepage: () => ({
    settings: {
      sectionTitles: {
        featuredProjects: 'FEATURED PROJECTS'
      }
    },
    loading: false
  })
}))


describe('Projects with CMS', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // The mock now returns real fixture data based on query
  })

  it('fetches and renders projects from Sanity', async () => {
    // The mock now automatically returns real fixture data
    render(<Projects />)
    
    // Check loading state initially
    expect(screen.getByText('FEATURED PROJECTS')).toBeInTheDocument()
    
    // Wait for real data to load and render
    await waitFor(() => {
      // These are the actual project titles from our Sanity data
      expect(screen.getByText('Echoes of Tomorrow')).toBeInTheDocument()
      expect(screen.getByText('The Last Station')).toBeInTheDocument()
      expect(screen.getByText('Neon Nights')).toBeInTheDocument()
    })
    
    // Verify fetch was called
    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining('*[_type == "project"')
    )
  })

  it('handles empty state when no projects exist', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValueOnce([])
    
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('No projects available at the moment.')).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(client.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('No projects available at the moment.')).toBeInTheDocument()
    })
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching projects:',
      expect.any(Error)
    )
    
    consoleErrorSpy.mockRestore()
  })

  it('opens modal when project is clicked', async () => {
    // Use real fixture data
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Echoes of Tomorrow')).toBeInTheDocument()
    })
    
    // Click on the project card
    const projectCard = screen.getByText('Echoes of Tomorrow').closest('div[class*="cursor-pointer"]')
    fireEvent.click(projectCard!)
    
    // Check modal content is displayed with real data
    await waitFor(() => {
      expect(screen.getByText('Project Overview')).toBeInTheDocument()
      // Check for part of the actual description from fixtures
      expect(screen.getByText(/Transformed 20,000 sq ft warehouse/)).toBeInTheDocument()
    })
  })

  it('closes modal when close button is clicked', async () => {
    // Use real fixture data
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Echoes of Tomorrow')).toBeInTheDocument()
    })
    
    // Open modal
    const projectCard = screen.getByText('Echoes of Tomorrow').closest('div[class*="cursor-pointer"]')
    fireEvent.click(projectCard!)
    
    await waitFor(() => {
      expect(screen.getByText('Project Overview')).toBeInTheDocument()
    })
    
    // Close modal - find the close button by its specific class
    const closeButton = document.querySelector('button.absolute.top-4.right-4')
    if (closeButton) fireEvent.click(closeButton)
    
    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('Project Overview')).not.toBeInTheDocument()
    })
  })

  it('navigates through gallery images', async () => {
    // Use real fixture data - "Echoes of Tomorrow" has gallery images
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Echoes of Tomorrow')).toBeInTheDocument()
    })
    
    // Open modal
    const projectCard = screen.getByText('Echoes of Tomorrow').closest('div[class*="cursor-pointer"]')
    fireEvent.click(projectCard!)
    
    await waitFor(() => {
      expect(screen.getByText('Project Overview')).toBeInTheDocument()
    })
    
    // Find navigation buttons (they have SVG icons)
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons.find(btn => 
      btn.querySelector('svg path[d="M9 5l7 7-7 7"]')
    )
    const prevButton = buttons.find(btn => 
      btn.querySelector('svg path[d="M15 19l-7-7 7-7"]')
    )
    
    // Click next button
    if (nextButton) fireEvent.click(nextButton)
    
    // Click previous button
    if (prevButton) fireEvent.click(prevButton)
    
    // Verify images are rendered
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('displays project credits when available', async () => {
    // Use real fixture data - "Echoes of Tomorrow" has credits
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Echoes of Tomorrow')).toBeInTheDocument()
    })
    
    // Open modal
    const projectCard = screen.getByText('Echoes of Tomorrow').closest('div[class*="cursor-pointer"]')
    fireEvent.click(projectCard!)
    
    // Check credits are displayed with real data
    await waitFor(() => {
      expect(screen.getByText('Credits')).toBeInTheDocument()
      expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
      expect(screen.getByText('Lisa Park')).toBeInTheDocument()
    })
  })

  it('displays technical details when available', async () => {
    // Use real fixture data - "Echoes of Tomorrow" has technical details
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Echoes of Tomorrow')).toBeInTheDocument()
    })
    
    // Open modal
    const projectCard = screen.getByText('Echoes of Tomorrow').closest('div[class*="cursor-pointer"]')
    fireEvent.click(projectCard!)
    
    // Check technical details are displayed with real data
    await waitFor(() => {
      expect(screen.getByText('Technical Details')).toBeInTheDocument()
      expect(screen.getByText('20,000 sq ft')).toBeInTheDocument()
      expect(screen.getByText('12 weeks')).toBeInTheDocument()
      expect(screen.getByText('Rain towers')).toBeInTheDocument()
      expect(screen.getByText('Modular facades')).toBeInTheDocument()
    })
  })

  it('renders projects with missing images gracefully', async () => {
    const mockProjects = [
      {
        _id: 'project-1', 
        title: 'No Image Project',
        type: 'Test Type',
        client: 'Test Client',
        year: 2024,
        featured: true,
        order: 1
        // No mainImage field
      }
    ]
    
    ;(client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects)
    
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('No Image Project')).toBeInTheDocument()
      expect(screen.getByText('No image available')).toBeInTheDocument()
    })
  })
})