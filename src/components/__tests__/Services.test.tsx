import { render, screen } from '@testing-library/react'
import Services from '@/components/Services'

describe('Services', () => {
  it('renders the section heading', () => {
    render(<Services />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('WHAT WE DESTROY')
  })

  it('renders the subtitle', () => {
    render(<Services />)
    expect(screen.getByText('⚡ AND REBUILD ⚡')).toBeInTheDocument()
  })

  it('renders service titles', () => {
    render(<Services />)
    
    expect(screen.getByText('SET DESTRUCTION')).toBeInTheDocument()
    expect(screen.getByText('SCENIC CHAOS')).toBeInTheDocument()
    expect(screen.getByText('COMMUNITY ANARCHY')).toBeInTheDocument()
  })

  it('renders service descriptions', () => {
    render(<Services />)
    
    expect(screen.getByText(/We demolish reality and rebuild your wildest nightmares/)).toBeInTheDocument()
    expect(screen.getByText(/Graffiti-style scenic painting that screams attitude/)).toBeInTheDocument()
    expect(screen.getByText(/Building spaces where creatives can unleash hell/)).toBeInTheDocument()
  })

  it('renders service icons', () => {
    render(<Services />)
    
    const icons = screen.getAllByTestId('service-icon')
    expect(icons).toHaveLength(3)
  })

  it('has proper section structure', () => {
    render(<Services />)
    
    const section = screen.getByRole('region')
    expect(section).toBeInTheDocument()
  })

  it('renders services grid', () => {
    render(<Services />)
    
    const grid = screen.getByTestId('services-grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid')
  })

  it('displays tagline', () => {
    render(<Services />)
    
    expect(screen.getByText('💀 NO LIMITS • NO COMPROMISE • NO FEAR 💀')).toBeInTheDocument()
  })
})