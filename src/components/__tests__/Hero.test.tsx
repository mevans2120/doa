import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Department')
    expect(heading).toHaveTextContent('of Art')
  })

  it('renders the call-to-action buttons', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Start Your Project' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Our Work' })).toBeInTheDocument()
  })

  it('has proper section role', () => {
    render(<Hero />)
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Hero />)
    expect(screen.getByText('Professional Set Construction & Design')).toBeInTheDocument()
  })

  it('displays service categories', () => {
    render(<Hero />)
    expect(screen.getByText('Film • Television • Commercial Productions')).toBeInTheDocument()
    expect(screen.getByText('Portland, Oregon')).toBeInTheDocument()
    expect(screen.getByText('Crafting Extraordinary Environments Since 2010')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Hero />)
    expect(screen.getByText(/We bring creative visions to life/)).toBeInTheDocument()
  })
})