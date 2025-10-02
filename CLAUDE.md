# DOA Website - Claude Instructions

## 🔴 IMPORTANT: Hybrid Memory System

### START OF EVERY SESSION
Run: `npm run session:start`

This loads:
- ✅ Memory Bank status (project overview)
- ✅ Claude Memory (current session, tech stack)
- ✅ Learned patterns

### DURING SESSION
- Session state auto-updates in `.claude-memory/session/current.json`
- Add notes: `npm run memory:note "Important context"`
- Check status: `npm run memory:show`

### END OF SESSION
Run: `npm run session:end`

Then update Memory Bank files:
- `memory-bank/CURRENT.md` - Project status
- `memory-bank/progress.md` - Session summary

### When to Use Each System

| Content | Claude Memory | Memory Bank |
|---------|--------------|-------------|
| Current task | ✅ | ❌ |
| Code patterns | ✅ | ❌ |
| Architecture decisions | ❌ | ✅ |
| Deployment records | ❌ | ✅ |

---

## Project Context

**DOA** is a professional services website built with modern web technologies. The site showcases digital services, client work, and includes contact functionality.

## Tech Stack

### Core
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Runtime**: React 19
- **Bundler**: Turbopack

### Styling
- **CSS Framework**: Tailwind CSS 4
- **Components**: styled-components for complex UI elements
- **Approach**: Mobile-first responsive design

### CMS & Content
- **CMS**: Sanity CMS
- **Integration**: next-sanity
- **Images**: @sanity/image-url
- **Content**: Portable Text with @portabletext/react

### Communication
- **Email Service**: Resend
- **Templates**: @react-email/components

### Testing
- **Unit Tests**: Jest with Testing Library
- **E2E Tests**: Playwright
- **Mocking**: MSW (Mock Service Worker)

### Analytics & Hosting
- **Analytics**: Vercel Analytics
- **Hosting**: Vercel
- **Package Manager**: npm

## Code Conventions

### File Structure
```
src/
├── app/              # Next.js pages (App Router)
├── components/       # React components
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── emails/           # Email templates
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Header.tsx`, `ContactCTA.tsx`)
- **Utilities**: kebab-case (e.g., `utils.ts`, `metadata.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useThemeDetection.ts`)
- **Contexts**: PascalCase with Context suffix (e.g., `HomepageContext.tsx`)

### Testing Conventions
- **Unit/Integration**: `__tests__/ComponentName.test.tsx`
- **CMS Integration**: `__tests__/ComponentName.cms.test.tsx`
- **E2E**: Playwright tests in `tests/` directory

### Code Style
- **Verbosity**: Concise, clear code
- **Comments**: Minimal, only for complex logic
- **Testing**: Comprehensive coverage (unit, integration, e2e)
- **Type Safety**: Strict TypeScript

## Development Workflow

### Starting Development
```bash
cd doa-website
npm run dev          # Start dev server with Turbopack
```

### Testing
```bash
npm test             # Unit tests
npm run test:watch   # Watch mode
npm run test:e2e     # E2E tests with Playwright
npm run test:all     # Run all tests
```

### Building
```bash
npm run build        # Production build
npm start            # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint
```

## Key Patterns

### CMS Integration
- All CMS content fetched via Sanity client
- Use TypeScript types for CMS schemas
- Portable Text for rich content rendering

### Component Architecture
- Context providers for shared state
- Custom hooks for reusable logic
- Styled-components for complex styling
- Tailwind utilities for layout and spacing

### Email Handling
- React Email components for templates
- Resend API for sending
- Contact form with auto-reply functionality

### Testing Strategy
- Mock Sanity client for CMS tests
- MSW for API mocking
- Playwright for E2E flows
- Testing Library for component tests

## Project Structure Notes

### Main Site (doa-website/)
The primary Next.js application with all production code.

### Root Level
Contains workspace-level configuration and the hybrid memory system.

## Best Practices

1. **Always run tests** after making changes
2. **Use TypeScript strictly** - avoid `any` types
3. **Mobile-first** responsive design
4. **Optimize images** through Sanity CDN
5. **Test CMS integration** with cms.test.tsx files
6. **Keep components focused** - single responsibility
7. **Use Tailwind utilities** first, styled-components for complex cases
8. **Document complex logic** with comments

## Environment Variables

Required environment variables are in `.env.local`:
- Sanity project configuration
- Resend API keys
- Other service credentials

---

*For memory system details, see `.claude-memory/README.md` and `memory-bank/SESSION_CHECKLIST.md`*

*For git workflow and commit procedures, see `memory-bank/GIT_WORKFLOW.md`*
