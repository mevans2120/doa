import { render, screen } from '@testing-library/react'
import Projects from '../Projects'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Recent Projects')
  })

  it('renders four project cards', () => {
    render(<Projects />)
    
    expect(screen.getByText('Project Image 1')).toBeInTheDocument()
    expect(screen.getByText('Project Image 2')).toBeInTheDocument()
    expect(screen.getByText('Project Image 3')).toBeInTheDocument()
    expect(screen.getByText('Project Image 4')).toBeInTheDocument()
  })

  it('has proper grid layout', () => {
    render(<Projects />)
    
    const projectsGrid = screen.getByTestId('projects-grid')
    expect(projectsGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')
  })

  it('applies correct background color', () => {
    render(<Projects />)
    
    const section = screen.getByRole('region')
    expect(section).toHaveClass('bg-doa-light-gray')
  })
})