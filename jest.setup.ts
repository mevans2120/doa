import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props: any) {
    const React = require('react')
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', props)
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'

// Extend Jest matchers with jest-dom
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
    }
  }
}