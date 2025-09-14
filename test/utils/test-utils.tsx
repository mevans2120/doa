import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { HomepageProvider } from '@/contexts/HomepageContext'

interface TestProviderProps {
  children: React.ReactNode
  initialSettings?: any
}

// Add all providers that wrap the app
const TestProvider = ({ children, initialSettings }: TestProviderProps) => {
  // Mock the HomepageProvider or provide test data
  if (initialSettings) {
    return (
      <HomepageProvider>
        {children}
      </HomepageProvider>
    )
  }
  
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  {
    initialSettings,
    ...renderOptions
  }: Omit<RenderOptions, 'wrapper'> & { initialSettings?: any } = {}
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProvider initialSettings={initialSettings}>{children}</TestProvider>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'