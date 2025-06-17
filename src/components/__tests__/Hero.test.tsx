import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('DOA brings your projects to life')
  })

  it('renders the subtitle', () => {
    render(<Hero />)
    expect(screen.getByText('Film, TV and commercial set design, construction & facilitation')).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Get in Touch' })).toBeInTheDocument()
  })

  it('has proper hero section structure', () => {
    render(<Hero />)
    
    const heroSection = screen.getByRole('banner')
    expect(heroSection).toBeInTheDocument()
    expect(heroSection).toHaveClass('relative', 'h-[600px]')
  })

  it('renders the watermark text', () => {
    render(<Hero />)
    expect(screen.getByText(/SKULL LOGO WATERMARK/)).toBeInTheDocument()
  })

  it('applies correct CTA button styling', () => {
    render(<Hero />)
    
    const ctaButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(ctaButton).toHaveClass('bg-doa-red', 'text-white')
  })
})