# DOA Set Construction Website

A modern, high-performance website for DOA Set Construction - Portland's most dangerous set builders specializing in film, TV, and commercial productions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
doa-website/
├── public/                     # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Page sections
│   │   └── __tests__/         # Component tests
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript definitions
│   └── constants/             # Application constants
├── docs/                      # Documentation
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── TDD_WORKFLOW.md
└── config files
```

## 🧪 Test-Driven Development (TDD)

This project follows strict TDD practices. See [`TDD_WORKFLOW.md`](./TDD_WORKFLOW.md) for detailed guidelines.

### TDD Cycle
1. **🔴 RED**: Write a failing test
2. **🟢 GREEN**: Write minimal code to pass
3. **🔵 REFACTOR**: Improve code quality

### Testing Commands
```bash
# Run all tests
npm test

# Watch mode (recommended during development)
npm run test:watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test Header.test.tsx
```

### Test Coverage Requirements
- **Minimum**: 80% overall coverage
- **Critical Components**: 95% coverage
- **New Features**: 100% coverage before merge

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Deployment**: Vercel

## 📋 Development Standards

### Component Guidelines

#### File Naming
- Components: `PascalCase.tsx` (e.g., `Header.tsx`)
- Tests: `ComponentName.test.tsx`
- Utilities: `camelCase.ts` (e.g., `utils.ts`)

#### Component Structure
```typescript
import React from 'react';
import { ComponentProps } from '@/types';

interface Props extends ComponentProps {
  title: string;
  isVisible?: boolean;
}

const ComponentName: React.FC<Props> = ({ 
  title, 
  isVisible = true,
  className = '' 
}) => {
  // Hooks at the top
  const [state, setState] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    setState(!state);
  };
  
  // Early returns
  if (!isVisible) return null;
  
  // Main render
  return (
    <div className={cn('component-base', className)}>
      <h1>{title}</h1>
      <button onClick={handleClick}>Toggle</button>
    </div>
  );
};

export default ComponentName;
```

### Testing Standards

#### Test Structure
```typescript
describe('ComponentName', () => {
  const defaultProps = {
    title: 'Test Title',
    isVisible: true,
  };

  const renderComponent = (props = {}) => {
    return render(<ComponentName {...defaultProps} {...props} />);
  };

  describe('Rendering', () => {
    it('renders with required props', () => {
      renderComponent();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      await user.click(screen.getByRole('button'));
      // Assert expected behavior
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderComponent();
      // Test accessibility
    });
  });
});
```

## 🎨 Design System

### Colors (Tailwind Custom)
```css
--doa-pink: #FF0080
--doa-neon: #00FF41
--doa-warning: #FFD700
--doa-light-gray: #1A1A1A
```

### Typography
- **Headers**: Creepster font family
- **Body**: Metal Mania font family
- **Buttons**: Fredoka One font family

### Component Categories
- **Atoms**: Button, Input, Icon, Text
- **Molecules**: SearchBox, NavigationItem, FormField
- **Organisms**: Header, Footer, ContactForm, ProjectGrid

## 🚀 Performance Standards

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization Techniques
- Next.js Image optimization
- Dynamic imports for code splitting
- Server-side rendering (SSR)
- Static generation where possible

## 🔧 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/component-name
# Make changes following TDD
git add .
git commit -m "feat: add component with tests"
git push origin feature/component-name
# Create PR
```

### Commit Convention
```
type(scope): description

feat(header): add mobile navigation
fix(button): resolve hover animation
test(hero): add accessibility tests
docs(readme): update installation
refactor(utils): simplify date formatting
```

### Code Review Checklist
- [ ] All tests pass
- [ ] Code coverage meets requirements
- [ ] TypeScript types properly defined
- [ ] Components follow naming conventions
- [ ] Accessibility requirements met
- [ ] Performance impact considered

## 📚 Documentation

- [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md) - Complete technical architecture and coding standards
- [`TDD_WORKFLOW.md`](./TDD_WORKFLOW.md) - Test-driven development workflow guide

## 🌐 Deployment

### Vercel Deployment
The project is configured for automatic deployment to Vercel:

1. **Development**: Auto-deploy from feature branches
2. **Staging**: Auto-deploy from `develop` branch
3. **Production**: Auto-deploy from `main` branch

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://api.doa-construction.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🧰 Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm start               # Start production server

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler
```

## 🤝 Contributing

1. **Follow TDD**: Write tests first, then implementation
2. **Code Standards**: Follow the established patterns
3. **Documentation**: Update docs for new features
4. **Testing**: Maintain test coverage requirements
5. **Review**: All code must be reviewed before merge

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd doa-website

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm run test:watch
```

## 📞 Support

For questions about the codebase or development practices:

1. Check the documentation in `/docs`
2. Review existing tests for examples
3. Create an issue for bugs or feature requests

## 🔒 License

This project is proprietary and confidential. All rights reserved.

---

**Built with 💀 by the DOA team**

*Last updated: December 2024*
