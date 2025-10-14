'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'

interface RichTextProps {
  value: TypedObject | TypedObject[]
  className?: string
}

/**
 * Custom Portable Text component with muted styling for black backgrounds
 * Supports: bold, italic, links
 *
 * Design principle: "A little goes a long way"
 * - Bold: Slightly brighter white with subtle weight increase
 * - Italic: Slightly more muted gray
 * - Links: Muted blue with subtle hover effect
 */
const RichText = ({ value, className = '' }: RichTextProps) => {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className={`text-gray-300 leading-relaxed mb-4 last:mb-0 ${className}`}>
          {children}
        </p>
      ),
    },
    marks: {
      // Bold: Slightly brighter white with subtle weight increase
      strong: ({ children }) => (
        <strong className="font-semibold text-gray-100">
          {children}
        </strong>
      ),

      // Italic: Slightly more muted gray
      em: ({ children }) => (
        <em className="italic text-gray-400">
          {children}
        </em>
      ),

      // Links: Bold gray with subtle hover effect
      link: ({ children, value }) => {
        const href = value?.href || '#'
        const isExternal = href.startsWith('http')

        return (
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-gray-500 hover:text-gray-400 font-semibold transition-colors duration-200"
          >
            {children}
          </a>
        )
      },
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-gray-300 leading-relaxed">
          {children}
        </li>
      ),
      number: ({ children }) => (
        <li className="text-gray-300 leading-relaxed">
          {children}
        </li>
      ),
    },
  }

  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null
  }

  // Ensure value is always an array for PortableText
  const content = Array.isArray(value) ? value : [value]

  return <PortableText value={content} components={components} />
}

export default RichText
