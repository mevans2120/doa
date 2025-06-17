import { render, screen } from '@testing-library/react'
import Services from '../Services'

describe('Services', () => {
  it('renders the section heading', () => {
    render(<Services />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('What We Do')
  })

  it('renders all three service cards', () => {
    render(<Services />)
    
    expect(screen.getByText('Set Construction')).toBeInTheDocument()
    expect(screen.getByText('Scenic Painting')).toBeInTheDocument()
    expect(screen.getByText('Community Hub')).toBeInTheDocument()
  })

  it('renders service descriptions', () => {
    render(<Services />)
    
    const descriptions = screen.getAllByText(/Lorem ipsum dolor sit amet/)
    expect(descriptions).toHaveLength(3)
  })

  it('has proper grid layout', () => {
    render(<Services />)
    
    const servicesGrid = screen.getByTestId('services-grid')
    expect(servicesGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3')
  })

  it('renders service icons', () => {
    render(<Services />)
    
    const serviceIcons = screen.getAllByTestId('service-icon')
    expect(serviceIcons).toHaveLength(3)
  })
})