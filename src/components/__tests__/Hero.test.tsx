import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('DEPARTMENT')
    expect(heading).toHaveTextContent('of ART')
  })

  it('renders the call-to-action buttons', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Get in Touch' })).toBeInTheDocument()
  })

  it('has proper section role', () => {
    render(<Hero />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Hero />)
    expect(screen.getByText(/We bring creative visions to life/)).toBeInTheDocument()
  })
})