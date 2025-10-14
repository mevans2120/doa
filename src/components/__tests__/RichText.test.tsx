import { render, screen } from '@testing-library/react'
import RichText from '../RichText'

describe('RichText', () => {
  it('renders normal text', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Hello world' }],
      },
    ]
    render(<RichText value={content} />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders bold text with correct styling', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Bold text', marks: ['strong'] }],
        markDefs: [],
      },
    ]
    render(<RichText value={content} />)
    const boldElement = screen.getByText('Bold text')
    expect(boldElement.tagName).toBe('STRONG')
    expect(boldElement).toHaveClass('font-semibold', 'text-gray-100')
  })

  it('renders italic text with correct styling', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Italic text', marks: ['em'] }],
        markDefs: [],
      },
    ]
    render(<RichText value={content} />)
    const italicElement = screen.getByText('Italic text')
    expect(italicElement.tagName).toBe('EM')
    expect(italicElement).toHaveClass('italic', 'text-gray-400')
  })

  it('renders external links with correct attributes', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Click here', marks: ['abc123'] }],
        markDefs: [
          {
            _key: 'abc123',
            _type: 'link',
            href: 'https://example.com',
          },
        ],
      },
    ]
    render(<RichText value={content} />)
    const link = screen.getByText('Click here')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders internal links without target blank', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Internal link', marks: ['def456'] }],
        markDefs: [
          {
            _key: 'def456',
            _type: 'link',
            href: '/about',
          },
        ],
      },
    ]
    render(<RichText value={content} />)
    const link = screen.getByText('Internal link')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/about')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders links with muted blue styling', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Link', marks: ['xyz789'] }],
        markDefs: [
          {
            _key: 'xyz789',
            _type: 'link',
            href: 'https://example.com',
          },
        ],
      },
    ]
    render(<RichText value={content} />)
    const link = screen.getByText('Link')
    expect(link).toHaveClass(
      'text-blue-400',
      'hover:text-blue-300',
      'underline-offset-2',
      'transition-colors'
    )
  })

  it('handles empty content gracefully', () => {
    const { container } = render(<RichText value={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('handles null content gracefully', () => {
    const { container } = render(<RichText value={null as unknown as Parameters<typeof RichText>[0]['value']} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Test' }],
      },
    ]
    const { container } = render(<RichText value={content} className="custom-class" />)
    const paragraph = container.querySelector('p')
    expect(paragraph).toHaveClass('custom-class')
  })

  it('renders multiple paragraphs', () => {
    const content = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'First paragraph' }],
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Second paragraph' }],
      },
    ]
    render(<RichText value={content} />)
    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
  })

  it('renders bullet lists with correct styling', () => {
    const content = [
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'List item 1' }],
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'List item 2' }],
      },
    ]
    render(<RichText value={content} />)
    const listItem1 = screen.getByText('List item 1')
    const listItem2 = screen.getByText('List item 2')
    expect(listItem1.tagName).toBe('LI')
    expect(listItem2.tagName).toBe('LI')
    expect(listItem1).toHaveClass('text-gray-300', 'leading-relaxed')
  })
})
