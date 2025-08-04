import { render, screen } from '@testing-library/react'
import Services from '@/components/Services'

describe('Services', () => {
  it('renders the section heading', () => {
    render(<Services />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Our Services')
  })

  it('renders the subtitle', () => {
    render(<Services />)
    expect(screen.getByText('Comprehensive Set Construction & Design Solutions')).toBeInTheDocument()
  })

  it('renders service titles', () => {
    render(<Services />)
    
    expect(screen.getByText('Set Construction')).toBeInTheDocument()
    expect(screen.getByText('Prop Building')).toBeInTheDocument()
    expect(screen.getByText('Production Services')).toBeInTheDocument()
  })

  it('renders service descriptions', () => {
    render(<Services />)
    
    expect(screen.getByText(/Expert craftsmanship in building custom sets/)).toBeInTheDocument()
    expect(screen.getByText(/Custom fabrication of props and set pieces/)).toBeInTheDocument()
    expect(screen.getByText(/Comprehensive support throughout the production process/)).toBeInTheDocument()
  })

  it('renders service icons', () => {
    render(<Services />)
    
    const icons = screen.getAllByText('Icon')
    expect(icons).toHaveLength(3)
  })

  it('has proper section structure', () => {
    render(<Services />)
    
    const section = screen.getByRole('region')
    expect(section).toBeInTheDocument()
  })

  it('renders services grid', () => {
    render(<Services />)
    
    const grid = screen.getByRole('region').querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid')
  })
})