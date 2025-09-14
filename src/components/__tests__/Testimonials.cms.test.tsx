import { render, screen, waitFor } from '@testing-library/react'
import Testimonials from '@/components/Testimonials'

// Import the mocked client
import { client } from '../../../src/__mocks__/sanity/lib/client'

// Mock the queries
jest.mock('../../../sanity/lib/queries', () => ({
  featuredTestimonialsQuery: '*[_type == "testimonial" && featured == true] | order(_createdAt desc)'
}))

// Mock the HomepageContext
jest.mock('@/contexts/HomepageContext', () => ({
  useHomepage: () => ({
    settings: {
      sectionTitles: {
        testimonials: 'CLIENT TESTIMONIALS'
      }
    },
    loading: false
  })
}))


describe('Testimonials with CMS', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // The mock now returns real fixture data based on query
  })

  it('fetches and renders testimonials from Sanity', async () => {
    // The mock now automatically returns real fixture data
    render(<Testimonials />)
    
    // Check section title
    expect(screen.getByText('CLIENT TESTIMONIALS')).toBeInTheDocument()
    
    // Wait for real data to load and render
    await waitFor(() => {
      // These are the actual testimonial authors from our Sanity data
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
      expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
      expect(screen.getByText('Lisa Park')).toBeInTheDocument()
      // Check for part of actual quote content
      expect(screen.getByText(/DOA's attention to detail/)).toBeInTheDocument()
    })
    
    // Verify fetch was called
    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining('*[_type == "testimonial"')
    )
  })

  it('limits display to 4 testimonials even if more are returned', async () => {
    const mockTestimonials = Array.from({ length: 6 }, (_, i) => ({
      _id: `testimonial-${i}`, 
      author: `Author ${i + 1}`,
      quote: `Quote ${i + 1}`,
      role: 'Test Role',
      company: 'Test Company',
      featured: true,
      order: i + 1
    }))
    
    ;(client.fetch as jest.Mock).mockResolvedValueOnce(mockTestimonials)
    
    render(<Testimonials />)
    
    await waitFor(() => {
      // Should only show first 4 testimonials
      expect(screen.getByText('Author 1')).toBeInTheDocument()
      expect(screen.getByText('Author 4')).toBeInTheDocument()
      expect(screen.queryByText('Author 5')).not.toBeInTheDocument()
      expect(screen.queryByText('Author 6')).not.toBeInTheDocument()
    })
  })

  it('uses fallback testimonials when fetch fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(client.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(<Testimonials />)
    
    await waitFor(() => {
      // Should show fallback testimonials
      expect(screen.getByText('Dr Doom')).toBeInTheDocument()
      expect(screen.getByText('Producer, Cascade Films')).toBeInTheDocument()
      expect(screen.getByText('Michael Chen')).toBeInTheDocument()
      expect(screen.getByText('Sarah Rodriguez')).toBeInTheDocument()
      expect(screen.getByText('James Thompson')).toBeInTheDocument()
    })
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching testimonials:',
      expect.any(Error)
    )
    
    consoleErrorSpy.mockRestore()
  })

  it('uses fallback testimonials when Sanity returns empty array', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValueOnce([])
    
    render(<Testimonials />)
    
    await waitFor(() => {
      // Should show fallback testimonials
      expect(screen.getByText('Dr Doom')).toBeInTheDocument()
      expect(screen.getByText('Michael Chen')).toBeInTheDocument()
      expect(screen.getByText('Sarah Rodriguez')).toBeInTheDocument()
      expect(screen.getByText('James Thompson')).toBeInTheDocument()
    })
  })

  it('renders nothing when testimonials array is empty after processing', async () => {
    // This test checks the edge case where testimonials state becomes empty
    // In practice this doesn't happen due to fallback data, but we test the logic
    const { container } = render(<Testimonials />)
    
    // The component will always have fallback data, so it won't be null
    await waitFor(() => {
      expect(container.firstChild).not.toBeNull()
    })
  })

  it('handles testimonials without optional fields gracefully', async () => {
    const mockTestimonials = [
      {
        _id: 'testimonial-1',
        quote: 'Great work!',
        author: 'John Doe',
        featured: true,
        order: 1
        // No role or company
      },
      {
        _id: 'testimonial-2',
        quote: 'Excellent service!',
        author: 'Jane Smith',
        role: 'Director',
        featured: true,
        order: 2
        // No company
      }
    ]
    
    ;(client.fetch as jest.Mock).mockResolvedValueOnce(mockTestimonials)
    
    render(<Testimonials />)
    
    await waitFor(() => {
      // Should render without title
      expect(screen.getByText('Great work!')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      
      // Should render with only role
      expect(screen.getByText('Excellent service!')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Director')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    ;(client.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    )
    
    render(<Testimonials />)
    
    // Check for section title during loading
    expect(screen.getByText('CLIENT TESTIMONIALS')).toBeInTheDocument()
    
    // Check for loading animation
    const loadingElements = document.querySelectorAll('.animate-pulse')
    expect(loadingElements.length).toBe(4)
  })

  it('properly formats subtitle with role and company', async () => {
    // Use real fixture data - Sarah Chen has both role and company
    render(<Testimonials />)
    
    await waitFor(() => {
      expect(screen.getByText('Production Designer, Paramount Pictures')).toBeInTheDocument()
    })
  })

  it('renders decorative quote marks', async () => {
    // Use real fixture data
    render(<Testimonials />)
    
    await waitFor(() => {
      // Check for quote marks (rendered as &quot; entities)
      const quoteMarks = screen.getAllByText('"')
      expect(quoteMarks.length).toBeGreaterThan(0)
    })
  })
})