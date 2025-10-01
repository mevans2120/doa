import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the DOA logo', () => {
    render(<Header />)
    expect(screen.getByAltText('Department of Art')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header />)
    
    // Click the hamburger menu to open the navigation overlay
    const menuButton = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(menuButton)
    
    // Now check for the navigation links with correct text
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Our Work' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'What We Do' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Our Clients' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('has proper navigation structure', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const logo = screen.getByAltText('Department of Art')
    expect(logo).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('flex', 'justify-between', 'items-center')
  })
})