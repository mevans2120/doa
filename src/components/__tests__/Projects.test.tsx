import { render, screen } from '@testing-library/react'
import Projects from '@/components/Projects'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('CHAOS WE\'VE CREATED')
  })

  it('renders the subtitle', () => {
    render(<Projects />)
    expect(screen.getByText('💀 RECENT DESTRUCTION 💀')).toBeInTheDocument()
  })

  it('renders project cards', () => {
    render(<Projects />)
    
    // Check for project titles
    expect(screen.getByText('APOCALYPSE SET')).toBeInTheDocument()
    expect(screen.getByText('NEON NIGHTMARE')).toBeInTheDocument()
  })

  it('has proper section structure', () => {
    render(<Projects />)
    
    const section = screen.getByRole('region')
    expect(section).toBeInTheDocument()
  })

  it('applies correct background color', () => {
    render(<Projects />)
    
    const section = screen.getByRole('region')
    expect(section).toHaveClass('bg-black')
  })

  it('renders projects grid', () => {
    render(<Projects />)
    
    const grid = screen.getByTestId('projects-grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid')
  })

  it('displays project categories', () => {
    render(<Projects />)
    
    expect(screen.getByText('HORROR FILM')).toBeInTheDocument()
    expect(screen.getByText('TV SERIES')).toBeInTheDocument()
  })
})