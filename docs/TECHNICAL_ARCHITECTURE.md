# DOA Website - Technical Architecture & Coding Standards

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Test-Driven Development (TDD)](#test-driven-development-tdd)
6. [Coding Standards](#coding-standards)
7. [Component Guidelines](#component-guidelines)
8. [Testing Guidelines](#testing-guidelines)
9. [Performance Standards](#performance-standards)
10. [Deployment & CI/CD](#deployment--cicd)
11. [Development Workflow](#development-workflow)

## Project Overview

The DOA Website is a modern, high-performance web application built for a Portland-based set construction company specializing in film, TV, and commercial productions. The site features a punk rock aesthetic with aggressive styling and interactive elements.

### Key Requirements
- **Performance**: Fast loading times and smooth animations
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Optimized for search engines
- **Responsive**: Mobile-first design approach
- **Maintainability**: Clean, testable, and scalable code

## Architecture Overview

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│                Browser                  │
├─────────────────────────────────────────┤
│            Next.js App Router           │
├─────────────────────────────────────────┤
│         React Components Layer          │
├─────────────────────────────────────────┤
│         Tailwind CSS Styling           │
├─────────────────────────────────────────┤
│            Static Assets                │
└─────────────────────────────────────────┘
```

### Design Patterns
- **Component-Based Architecture**: Modular, reusable React components
- **Server-Side Rendering (SSR)**: Next.js App Router for optimal performance
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Separation of Concerns**: Clear separation between logic, presentation, and styling

## Technology Stack

### Core Technologies
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.x
- **Styling**: Tailwind CSS 4.x
- **Testing**: Jest 30.x + React Testing Library
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Type Checking**: TypeScript strict mode
- **Code Formatting**: ESLint + Prettier (recommended)
- **Version Control**: Git
- **Deployment**: Vercel

## Project Structure

```
doa-website/
├── public/                     # Static assets
│   ├── images/                # Image assets
│   ├── icons/                 # Icon files
│   └── fonts/                 # Custom fonts
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── [feature]/         # Feature-based routing
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components (atoms)
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Page sections (organisms)
│   │   └── __tests__/         # Component tests
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── constants/             # Application constants
├── __tests__/                 # Integration tests
├── docs/                      # Documentation
└── config files              # Configuration files
```

## Test-Driven Development (TDD)

### TDD Principles
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests green

### TDD Workflow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Write Test │ -> │ Write Code  │ -> │  Refactor   │
│    (Red)    │    │   (Green)   │    │   (Blue)    │
└─────────────┘    └─────────────┘    └─────────────┘
       ^                                      │
       └──────────────────────────────────────┘
```

### Testing Strategy
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows (future implementation)
- **Visual Regression Tests**: UI consistency (future implementation)

### Test Coverage Requirements
- **Minimum Coverage**: 80% overall
- **Critical Components**: 95% coverage
- **New Features**: 100% coverage required before merge

## Coding Standards

### TypeScript Standards

#### Type Definitions
```typescript
// ✅ Good: Explicit interface definitions
interface ComponentProps {
  title: string;
  description?: string;
  isVisible: boolean;
  onClick: () => void;
}

// ✅ Good: Union types for specific values
type ButtonVariant = 'primary' | 'secondary' | 'danger';

// ❌ Bad: Using 'any' type
const data: any = fetchData();
```

#### Function Declarations
```typescript
// ✅ Good: Arrow functions for components
const Header: React.FC = () => {
  return <nav>...</nav>;
};

// ✅ Good: Explicit return types for utilities
const formatDate = (date: Date): string => {
  return date.toISOString();
};

// ✅ Good: Generic types when needed
const createApiClient = <T>(baseUrl: string): ApiClient<T> => {
  // implementation
};
```

### React Component Standards

#### Component Structure
```typescript
// ✅ Good: Component template
import React from 'react';
import { ComponentProps } from './types';

interface Props extends ComponentProps {
  // Additional props
}

const ComponentName: React.FC<Props> = ({ 
  title, 
  description, 
  isVisible,
  onClick 
}) => {
  // Hooks at the top
  const [state, setState] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    onClick();
    setState(!state);
  };
  
  // Early returns for conditional rendering
  if (!isVisible) {
    return null;
  }
  
  // Main render
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default ComponentName;
```

#### Naming Conventions
- **Components**: PascalCase (`Header`, `ContactForm`)
- **Files**: PascalCase for components (`Header.tsx`)
- **Variables**: camelCase (`isVisible`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: kebab-case (`nav-item`, `btn-primary`)

### CSS/Tailwind Standards

#### Class Organization
```typescript
// ✅ Good: Logical grouping of classes
const buttonClasses = [
  // Layout
  'flex items-center justify-center',
  // Spacing
  'px-6 py-3 gap-2',
  // Typography
  'text-lg font-bold uppercase tracking-wide',
  // Colors
  'bg-doa-pink text-black',
  // Effects
  'hover:bg-doa-neon hover:animate-pulse',
  // Transitions
  'transition-all duration-300'
].join(' ');

// ❌ Bad: Long, unorganized class strings
const badClasses = "flex items-center justify-center px-6 py-3 gap-2 text-lg font-bold uppercase tracking-wide bg-doa-pink text-black hover:bg-doa-neon hover:animate-pulse transition-all duration-300";
```

#### Custom CSS Classes
```css
/* ✅ Good: Semantic class names */
.punk-btn {
  @apply bg-gradient-to-r from-doa-pink to-doa-warning;
  @apply text-black font-bold px-8 py-4;
  @apply border-4 border-black;
  @apply hover:animate-shake;
}

.neon-text {
  text-shadow: 
    0 0 5px currentColor,
    0 0 10px currentColor,
    0 0 15px currentColor;
}
```

## Component Guidelines

### Component Categories

#### 1. Atoms (Basic UI Elements)
```typescript
// Button, Input, Icon, Text
const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### 2. Molecules (Simple Component Groups)
```typescript
// SearchBox, NavigationItem, FormField
const NavigationItem: React.FC<NavItemProps> = ({ href, children }) => {
  return (
    <Link href={href} className="nav-item">
      {children}
    </Link>
  );
};
```

#### 3. Organisms (Complex Components)
```typescript
// Header, Footer, ContactForm, ProjectGrid
const Header: React.FC = () => {
  return (
    <nav className="header">
      <Logo />
      <Navigation />
      <ContactButton />
    </nav>
  );
};
```

### Component Best Practices

#### Props Interface
```typescript
// ✅ Good: Clear, documented props
interface ComponentProps {
  /** The main title to display */
  title: string;
  /** Optional description text */
  description?: string;
  /** Whether the component is visible */
  isVisible?: boolean;
  /** Callback fired when component is clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}
```

#### Error Boundaries
```typescript
// ✅ Good: Error boundary for critical components
const ComponentWithErrorBoundary: React.FC<Props> = (props) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Component {...props} />
    </ErrorBoundary>
  );
};
```

## Testing Guidelines

### Test File Structure
```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  // Test data
  const defaultProps = {
    title: 'Test Title',
    isVisible: true,
    onClick: jest.fn(),
  };

  // Helper function
  const renderComponent = (props = {}) => {
    return render(<ComponentName {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with required props', () => {
      renderComponent();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
      renderComponent({ isVisible: false });
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      
      renderComponent({ onClick: mockClick });
      
      await user.click(screen.getByRole('button'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderComponent();
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
  });
});
```

### Testing Best Practices

#### Test Naming
```typescript
// ✅ Good: Descriptive test names
describe('Header component', () => {
  it('renders navigation links with correct href attributes', () => {});
  it('highlights active navigation item based on current route', () => {});
  it('opens mobile menu when hamburger button is clicked', () => {});
});

// ❌ Bad: Vague test names
describe('Header', () => {
  it('works', () => {});
  it('renders stuff', () => {});
});
```

#### Test Organization
```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    // Tests for what renders
  });

  describe('Props', () => {
    // Tests for prop handling
  });

  describe('Interactions', () => {
    // Tests for user interactions
  });

  describe('Accessibility', () => {
    // Tests for a11y compliance
  });

  describe('Edge Cases', () => {
    // Tests for error states, empty data, etc.
  });
});
```

### Test Coverage Requirements

#### Critical Components (95% coverage)
- Header navigation
- Contact forms
- Payment processing
- User authentication

#### Standard Components (80% coverage)
- Display components
- Layout components
- Utility components

#### Testing Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Header.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders"
```

## Performance Standards

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Best Practices

#### Image Optimization
```typescript
// ✅ Good: Next.js Image component
import Image from 'next/image';

const OptimizedImage: React.FC = () => {
  return (
    <Image
      src="/hero-image.jpg"
      alt="DOA set construction"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
};
```

#### Code Splitting
```typescript
// ✅ Good: Dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // If component doesn't need SSR
});
```

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

## Deployment & CI/CD

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Environment Configuration
```typescript
// lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  environment: process.env.NODE_ENV || 'development',
  analytics: {
    googleId: process.env.NEXT_PUBLIC_GA_ID,
  },
} as const;
```

## Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/component-name
git add .
git commit -m "feat: add new component with tests"
git push origin feature/component-name

# Create PR with:
# - Description of changes
# - Test coverage report
# - Screenshots (if UI changes)
```

### Commit Message Convention
```
type(scope): description

feat(header): add mobile navigation menu
fix(button): resolve hover state animation
test(hero): add accessibility tests
docs(readme): update installation instructions
refactor(utils): simplify date formatting function
```

### Code Review Checklist
- [ ] All tests pass
- [ ] Code coverage meets requirements
- [ ] TypeScript types are properly defined
- [ ] Components follow naming conventions
- [ ] Accessibility requirements met
- [ ] Performance impact considered
- [ ] Documentation updated

### Development Commands
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## Quality Gates

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
}
```

### Definition of Done
- [ ] Feature implemented according to requirements
- [ ] Unit tests written and passing (TDD)
- [ ] Integration tests passing
- [ ] Code review completed
- [ ] Accessibility tested
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] QA testing completed

---

## Conclusion

This technical architecture document serves as the foundation for building and maintaining the DOA website. All team members should follow these standards to ensure code quality, maintainability, and performance.

For questions or suggestions regarding these standards, please create an issue in the project repository.

**Last Updated**: December 2024
**Version**: 1.0.0