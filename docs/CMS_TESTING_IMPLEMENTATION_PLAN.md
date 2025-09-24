# CMS Testing Implementation Plan

## Executive Summary
Implement comprehensive unit testing for Sanity CMS integration across the DOA website, ensuring reliable data fetching, error handling, and component rendering.

## Timeline: 2-3 Weeks

## Phase 1: Infrastructure Setup (Days 1-2)

### 1.1 Install Dependencies
```bash
npm install --save-dev msw whatwg-fetch
```

### 1.2 Create Directory Structure
```
src/
├── __mocks__/
│   ├── sanity/
│   │   └── lib/
│   │       ├── client.ts
│   │       └── image.ts
│   └── next/
│       └── image.tsx
├── test/
│   ├── utils/
│   │   ├── test-utils.tsx
│   │   ├── render.tsx
│   │   └── mock-data.ts
│   ├── factories/
│   │   ├── project.factory.ts
│   │   ├── service.factory.ts
│   │   ├── client.factory.ts
│   │   ├── testimonial.factory.ts
│   │   └── homepage.factory.ts
│   └── mocks/
│       ├── handlers.ts
│       └── server.ts
```

### 1.3 Configure Jest
**File: jest.setup.ts**
```typescript
import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { server } from './test/mocks/server'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
```

### 1.4 Update jest.config.js
```javascript
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**', // Exclude Next.js app directory pages
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
}
```

## Phase 2: Mock Infrastructure (Days 3-4)

### 2.1 Sanity Client Mock
**File: src/__mocks__/sanity/lib/client.ts**
```typescript
const mockClient = {
  fetch: jest.fn(),
  create: jest.fn(),
  createOrReplace: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  transaction: jest.fn(),
}

export const client = mockClient
export const createClient = jest.fn(() => mockClient)
```

### 2.2 Data Factories
**File: test/factories/service.factory.ts**
```typescript
import { faker } from '@faker-js/faker'

export const createMockService = (overrides = {}) => ({
  _id: faker.string.uuid(),
  _type: 'service',
  title: faker.company.buzzPhrase(),
  slug: { current: faker.helpers.slugify(faker.company.buzzPhrase()) },
  shortDescription: faker.lorem.sentence(),
  iconType: faker.helpers.arrayElement(['tools', 'building', 'brush']),
  category: faker.helpers.arrayElement(['production', 'design', 'rentals']),
  order: faker.number.int({ min: 0, max: 20 }),
  featured: faker.datatype.boolean(),
  ...overrides,
})

export const createMockServiceList = (count = 5, overrides = {}) => 
  Array.from({ length: count }, () => createMockService(overrides))
```

### 2.3 Test Utilities
**File: test/utils/test-utils.tsx**
```typescript
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { HomepageProvider } from '@/contexts/HomepageContext'

interface TestProviderProps {
  children: React.ReactNode
  initialSettings?: any
}

const TestProvider = ({ children, initialSettings }: TestProviderProps) => {
  return (
    <HomepageProvider initialSettings={initialSettings}>
      {children}
    </HomepageProvider>
  )
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

export * from '@testing-library/react'
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'
```

## Phase 3: Component Testing (Days 5-10)

### 3.1 Priority 1: Core CMS Components

#### Test: HomepageContext
**File: src/contexts/__tests__/HomepageContext.test.tsx**
```typescript
describe('HomepageContext', () => {
  - Data fetching success
  - Error handling with fallback values
  - Loading state management
  - Settings persistence
  - Re-fetch on mount
})
```

#### Test: Services Component
**File: src/components/__tests__/Services.cms.test.tsx**
```typescript
describe('Services with CMS', () => {
  - Fetch all services
  - Fetch featured services only
  - Handle empty state
  - Handle loading state
  - Handle fetch error
  - Icon rendering based on iconType
  - Limit prop functionality
  - CTA button visibility logic
})
```

#### Test: Projects Component
**File: src/components/__tests__/Projects.cms.test.tsx**
```typescript
describe('Projects with CMS', () => {
  - Fetch featured projects
  - Modal open/close functionality
  - Gallery navigation
  - Image loading with fallbacks
  - Technical details rendering
  - Credits display
  - Empty state handling
})
```

### 3.2 Priority 2: Supporting Components

#### Test: ClientLogos
```typescript
describe('ClientLogos with CMS', () => {
  - Logo image rendering
  - White logo variant selection
  - Fallback to SVG logos
  - Client limit functionality
})
```

#### Test: Testimonials
```typescript
describe('Testimonials with CMS', () => {
  - Quote rendering
  - Author attribution
  - Title display (new field)
  - Featured filtering
  - Fallback testimonials
})
```

#### Test: AboutCTA
```typescript
describe('AboutCTA with CMS', () => {
  - Dynamic heading from settings
  - Dynamic description from settings
  - Button text and link configuration
  - Fallback content
})
```

## Phase 4: Query and Utility Testing (Days 11-12)

### 4.1 GROQ Query Tests
**File: sanity/lib/__tests__/queries.test.ts**
```typescript
describe('Sanity Queries', () => {
  describe('servicesQuery', () => {
    - Valid GROQ syntax
    - Correct field selection
    - Order clause present
  })
  
  describe('featuredProjectsQuery', () => {
    - Featured filter applied
    - Limit clause present
    - Field selection complete
  })
  
  describe('homepageSettingsQuery', () => {
    - Single document selection
    - Nested field structure
  })
})
```

### 4.2 Image URL Builder Tests
**File: sanity/lib/__tests__/image.test.ts**
```typescript
describe('Sanity Image URL Builder', () => {
  - URL generation with dimensions
  - Hotspot handling
  - Format conversion
  - Error handling for invalid assets
})
```

### 4.3 Migration Script Tests
**File: scripts/__tests__/migrate-services.test.ts**
```typescript
describe('Service Migration', () => {
  - Deletes existing services
  - Creates new services
  - Handles API errors
  - Validates data structure
})
```

## Phase 5: Integration Testing (Days 13-14)

### 5.1 Page-Level Tests
**File: src/app/__tests__/page.test.tsx**
```typescript
describe('Homepage Integration', () => {
  - All sections render with CMS data
  - Context provider supplies data
  - Loading states cascade properly
  - Error boundaries work
})
```

### 5.2 API Route Tests (if applicable)
```typescript
describe('API Routes', () => {
  - Contact form submission
  - Rate limiting
  - Validation errors
  - Success responses
})
```

## Phase 6: Coverage and CI/CD (Day 15)

### 6.1 Coverage Report Setup
```bash
# Add to package.json scripts
"test:coverage": "jest --coverage --watchAll=false",
"test:ci": "jest --ci --coverage --maxWorkers=2"
```

### 6.2 GitHub Actions Workflow
**File: .github/workflows/test.yml**
```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.SANITY_DATASET }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

## Implementation Checklist

### Week 1
- [ ] Set up testing infrastructure
- [ ] Install MSW and configure
- [ ] Create mock factories
- [ ] Create test utilities
- [ ] Mock Sanity client
- [ ] Write HomepageContext tests
- [ ] Write Services component tests

### Week 2
- [ ] Write Projects component tests
- [ ] Write remaining component tests
- [ ] Write GROQ query tests
- [ ] Write utility function tests
- [ ] Integration tests for pages
- [ ] Set up coverage reporting

### Week 3
- [ ] Fix failing tests
- [ ] Improve coverage to meet thresholds
- [ ] Set up CI/CD pipeline
- [ ] Documentation updates
- [ ] Team review and training

## Success Metrics

1. **Coverage Goals**
   - Line coverage: 80%+
   - Branch coverage: 70%+
   - Function coverage: 70%+
   - Statement coverage: 80%+

2. **Test Execution**
   - All tests pass in < 30 seconds
   - CI pipeline runs in < 5 minutes
   - Zero flaky tests

3. **Quality Indicators**
   - All error paths tested
   - All loading states tested
   - All empty states tested
   - Critical user journeys covered

## Risk Mitigation

1. **Flaky Tests**
   - Use MSW for consistent API mocking
   - Avoid testing implementation details
   - Use waitFor for async operations

2. **Performance Issues**
   - Run tests in parallel
   - Use focused test suites
   - Mock heavy dependencies

3. **Maintenance Burden**
   - Use factories for test data
   - Create reusable test utilities
   - Document testing patterns

## Resources Required

1. **Developer Time**: 15 days
2. **Tools**: MSW, Faker.js, Coverage tools
3. **Infrastructure**: GitHub Actions minutes
4. **Training**: Team testing workshop

## Next Steps

1. Review and approve plan
2. Allocate developer resources
3. Set up project board for tracking
4. Begin Phase 1 implementation
5. Weekly progress reviews

## Commands Reference

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test Services.cms.test

# Run tests in watch mode
npm run test:watch

# Update snapshots
npm test -- -u

# Run tests in CI mode
npm run test:ci

# Debug specific test
npm test -- --detectOpenHandles Services.cms.test
```