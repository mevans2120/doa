# CMS Unit Testing Strategy

## Overview
This document outlines the approach for unit testing the Sanity CMS integration in the DOA website.

## Current Testing Setup
- **Framework**: Jest with React Testing Library
- **Test Runner**: Jest 30.0.0
- **Testing Libraries**: 
  - @testing-library/react (16.3.0)
  - @testing-library/jest-dom (6.6.3)
  - @testing-library/user-event (14.6.1)

## Testing Requirements for CMS Integration

### 1. Mock Strategy for Sanity Client

#### Required Mocks
```typescript
// __mocks__/sanity/lib/client.ts
export const client = {
  fetch: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  transaction: jest.fn(),
}
```

#### Mock Data Factory
```typescript
// test/factories/sanity.ts
export const createMockProject = (overrides = {}) => ({
  _id: 'project-1',
  title: 'Test Project',
  slug: { current: 'test-project' },
  featured: false,
  ...overrides
})

export const createMockService = (overrides = {}) => ({
  _id: 'service-1',
  title: 'Test Service',
  shortDescription: 'Test description',
  iconType: 'tools',
  featured: false,
  order: 0,
  ...overrides
})
```

### 2. Components to Test

#### High Priority (Core CMS Integration)
1. **HomepageContext Provider**
   - Data fetching
   - Error handling
   - Loading states
   - Default fallbacks

2. **Services Component**
   - Dynamic data rendering
   - Loading states
   - Empty states
   - Featured filtering

3. **Projects Component**
   - Data fetching
   - Modal interactions
   - Gallery navigation
   - Error boundaries

4. **ClientLogos Component**
   - Logo rendering
   - Fallback handling
   - Dynamic limits

5. **Testimonials Component**
   - Quote rendering
   - Featured filtering
   - Fallback data

#### Medium Priority
- Hero Component (context usage)
- AboutCTA Component (dynamic content)
- Header/Footer (navigation)

### 3. Test Categories

#### Unit Tests
- **Sanity Queries**: Test GROQ query construction
- **Data Transformations**: Test data mapping and formatting
- **Component Logic**: Test state management and event handlers
- **Error Handling**: Test error boundaries and fallbacks

#### Integration Tests
- **API Mocking**: Mock Sanity API responses
- **Context Providers**: Test data flow through providers
- **Component Interactions**: Test user interactions

#### Snapshot Tests
- Component rendering with various data states
- Loading and error states
- Empty states

### 4. Implementation Plan

#### Phase 1: Setup Infrastructure
```bash
npm install --save-dev msw @types/testing-library__jest-dom
```

Create test utilities:
```typescript
// test/utils/test-utils.tsx
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { HomepageProvider } from '@/contexts/HomepageContext'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <HomepageProvider>{children}</HomepageProvider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

#### Phase 2: Mock Sanity Client
```typescript
// __mocks__/@sanity/client.ts
export const createClient = jest.fn(() => ({
  fetch: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
}))
```

#### Phase 3: Write Component Tests

Example test for Services with CMS:
```typescript
// src/components/__tests__/Services.cms.test.tsx
import { render, screen, waitFor } from '@/test/utils/test-utils'
import Services from '@/components/Services'
import { client } from '@/sanity/lib/client'

jest.mock('@/sanity/lib/client')

describe('Services with CMS', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and renders services from Sanity', async () => {
    const mockServices = [
      createMockService({ title: 'Set Construction' }),
      createMockService({ title: 'Custom Welding' }),
    ]
    
    (client.fetch as jest.Mock).mockResolvedValue(mockServices)
    
    render(<Services />)
    
    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Wait for data
    await waitFor(() => {
      expect(screen.getByText('Set Construction')).toBeInTheDocument()
      expect(screen.getByText('Custom Welding')).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    (client.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<Services />)
    
    await waitFor(() => {
      expect(screen.getByText(/No services available/i)).toBeInTheDocument()
    })
  })

  it('filters featured services when limit prop is provided', async () => {
    const mockServices = [
      createMockService({ featured: true }),
      createMockService({ featured: false }),
    ]
    
    (client.fetch as jest.Mock).mockResolvedValue(
      mockServices.filter(s => s.featured)
    )
    
    render(<Services limit={4} />)
    
    await waitFor(() => {
      expect(client.fetch).toHaveBeenCalledWith(
        expect.stringContaining('featured == true')
      )
    })
  })
})
```

### 5. Testing Sanity Queries

```typescript
// src/sanity/lib/__tests__/queries.test.ts
import { servicesQuery, featuredProjectsQuery } from '../queries'

describe('Sanity Queries', () => {
  it('constructs valid GROQ query for services', () => {
    expect(servicesQuery).toContain('_type == "service"')
    expect(servicesQuery).toContain('order(order asc)')
  })

  it('constructs valid GROQ query for featured projects', () => {
    expect(featuredProjectsQuery).toContain('featured == true')
    expect(featuredProjectsQuery).toContain('[0...6]')
  })
})
```

### 6. Testing Context Providers

```typescript
// src/contexts/__tests__/HomepageContext.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { HomepageProvider, useHomepage } from '../HomepageContext'
import { client } from '@/sanity/lib/client'

jest.mock('@/sanity/lib/client')

describe('HomepageContext', () => {
  it('fetches and provides homepage settings', async () => {
    const mockSettings = {
      heroSection: { showLogo: true },
      sectionTitles: { featuredProjects: 'Our Work' }
    }
    
    (client.fetch as jest.Mock).mockResolvedValue(mockSettings)
    
    const { result } = renderHook(() => useHomepage(), {
      wrapper: HomepageProvider
    })
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.settings).toEqual(mockSettings)
    })
  })

  it('provides fallback values on fetch error', async () => {
    (client.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    const { result } = renderHook(() => useHomepage(), {
      wrapper: HomepageProvider
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.settings.sectionTitles?.featuredProjects)
        .toBe('FEATURED PROJECTS')
    })
  })
})
```

### 7. Coverage Goals

- **Overall Coverage**: 80%+
- **Critical Paths**: 95%+ (data fetching, error handling)
- **UI Components**: 70%+
- **Utilities**: 100%

### 8. CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Run tests
  run: npm test -- --coverage --watchAll=false
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### 9. Best Practices

1. **Mock at the boundary**: Mock Sanity client, not internal functions
2. **Test behavior, not implementation**: Focus on user-visible outcomes
3. **Use factories**: Create reusable mock data factories
4. **Test error paths**: Always test loading, error, and empty states
5. **Avoid testing Sanity Studio**: Focus on frontend integration
6. **Use MSW for complex scenarios**: Mock Service Worker for API mocking

### 10. Tools & Resources

- **MSW (Mock Service Worker)**: For intercepting network requests
- **React Testing Library**: For component testing
- **Jest**: Test runner and mocking
- **Coverage Reports**: Use `npm test -- --coverage`

## Next Steps

1. Install MSW for better API mocking
2. Create mock data factories
3. Update existing tests for CMS integration
4. Add tests for new CMS components
5. Set up CI/CD test automation
6. Add coverage reporting

## Command Reference

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test Services.test

# Update snapshots
npm test -- -u

# Watch mode
npm test:watch
```