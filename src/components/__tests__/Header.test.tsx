import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders the DOA logo', () => {
    render(<Header />)
    expect(screen.getByText('DOA LOGO')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Capabilities' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Partners' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('has proper navigation structure', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const logo = screen.getByText('DOA LOGO')
    expect(logo).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('flex', 'justify-between', 'items-center')
  })
})