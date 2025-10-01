import { render, screen, waitFor } from '@testing-library/react'
import { HomepageProvider, useHomepage } from '@/contexts/HomepageContext'

// Import the mocked client
import { client } from '../../../src/__mocks__/sanity/lib/client'

// Mock the queries
jest.mock('../../../sanity/lib/queries', () => ({
  homepageSettingsQuery: '*[_type == "homepageSettings"][0]'
}))


// Test component to use the context
const TestComponent = () => {
  const { settings, loading } = useHomepage()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      <div data-testid="hero-title">{settings.heroSection?.mainTitle || 'No Title'}</div>
      <div data-testid="section-title-projects">{settings.sectionTitles?.featuredProjects || 'No Projects Title'}</div>
      <div data-testid="section-title-services">{settings.sectionTitles?.whatWeDo || 'No Services Title'}</div>
      <div data-testid="loading-state">{String(loading)}</div>
    </div>
  )
}

describe('HomepageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // The mock now returns real fixture data based on query
  })

  it('provides homepage settings from Sanity', async () => {
    // The mock now automatically returns real fixture data
    render(
      <HomepageProvider>
        <TestComponent />
      </HomepageProvider>
    )
    
    // Check loading state initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Wait for real data to load and render
    await waitFor(() => {
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Production Design & Set Construction')
      expect(screen.getByTestId('section-title-projects')).toHaveTextContent('FEATURED PROJECTS')
      expect(screen.getByTestId('section-title-services')).toHaveTextContent('WHAT WE DO')
    })
    
    // Verify fetch was called
    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining('*[_type == "homepageSettings"')
    )
  })

  it('provides default values when fetch fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(client.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(
      <HomepageProvider>
        <TestComponent />
      </HomepageProvider>
    )
    
    // Wait for error handling
    await waitFor(() => {
      expect(screen.getByTestId('section-title-projects')).toHaveTextContent('FEATURED PROJECTS')
      expect(screen.getByTestId('section-title-services')).toHaveTextContent('WHAT WE DO')
    })
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching homepage settings:',
      expect.any(Error)
    )
    
    consoleErrorSpy.mockRestore()
  })

  it('sets loading to false after fetch completes', async () => {
    // Use real fixture data
    render(
      <HomepageProvider>
        <TestComponent />
      </HomepageProvider>
    )
    
    // Initially loading
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
    })
  })

  it('handles null data from Sanity gracefully', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValueOnce(null)
    
    render(
      <HomepageProvider>
        <TestComponent />
      </HomepageProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-title')).toHaveTextContent('No Title')
      expect(screen.getByTestId('section-title-projects')).toHaveTextContent('No Projects Title')
    })
  })

  it('provides all section titles correctly', async () => {
    // Use real fixture data
    render(
      <HomepageProvider>
        <TestComponent />
      </HomepageProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('section-title-projects')).toHaveTextContent('FEATURED PROJECTS')
      expect(screen.getByTestId('section-title-services')).toHaveTextContent('WHAT WE DO')
    })
  })
})