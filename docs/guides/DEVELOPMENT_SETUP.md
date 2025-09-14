# Development Setup Guide

This guide will help you set up the Department of Art website for local development.

## Prerequisites

### Required Software
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**: v2.0 or higher

### Recommended Tools
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Sanity.io
- **Chrome/Firefox** with React Developer Tools

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mevans2120/doa.git
cd doa-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure environment variables (see below)
# Edit .env.local with your values

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Configuration

### 1. Sanity CMS Setup

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

To get these values:
1. Go to [sanity.io](https://sanity.io) and sign in
2. Navigate to your project dashboard
3. Find Project ID under project settings
4. Generate an API token with read permissions

### 2. Resend Email Setup (Optional for Development)

```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_FORM_TO_EMAIL=your-email@example.com
```

For development:
- Sign up at [resend.com](https://resend.com)
- Use the test API key for development
- Emails will only send to verified addresses in test mode

## Running the Project

### Development Server
```bash
npm run dev
# Runs on http://localhost:3000
# Hot reload enabled
```

### Sanity Studio
```bash
# Access at http://localhost:3000/studio
# Same dev server, different route
```

### Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
doa-website/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utility functions
│   └── emails/          # Email templates
├── sanity/
│   ├── lib/             # Sanity client and utilities
│   ├── schemaTypes/     # Content schemas
│   └── studio/          # Studio configuration
├── public/              # Static assets
├── test/               # Test utilities and fixtures
└── docs/               # Documentation
```

## Common Development Tasks

### Adding a New Page
1. Create file in `src/app/[page-name]/page.tsx`
2. Import necessary components
3. Add to navigation if needed

### Modifying Content Schema
1. Edit schema in `sanity/schemaTypes/`
2. Run migrations if needed: `npm run sanity:deploy`
3. Update TypeScript types

### Working with Components
1. Components go in `src/components/`
2. Use TypeScript for all components
3. Include tests in `__tests__` subfolder

### Styling
- Use Tailwind CSS classes primarily
- Custom CSS in component files using CSS modules
- Global styles in `app/globals.css`

## Testing

### Unit Tests
```bash
npm test              # Run all tests
npm test:watch       # Watch mode
npm test:coverage    # Coverage report
```

### E2E Tests
```bash
npm run test:e2e     # Run Playwright tests
npm run test:e2e:ui  # Open Playwright UI
```

### Linting & Formatting
```bash
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix issues
npm run type-check   # TypeScript check
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Sanity Connection Issues
- Verify project ID and dataset name
- Check API token permissions
- Ensure you're on the correct network (no VPN blocking)

### Build Failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Email Not Sending
- Check Resend API key is valid
- Verify sender email is verified in Resend
- Check rate limits haven't been exceeded

## IDE Setup

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Recommended Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "sanity-io.vscode-sanity",
    "christian-kohler.path-intellisense"
  ]
}
```

## Git Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Hotfix: `hotfix/description`

### Commit Messages
Follow conventional commits:
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### Pre-commit Checks
Before committing:
1. Run `npm run lint`
2. Run `npm test`
3. Run `npm run build`

## Getting Help

1. Check [Troubleshooting Guide](../maintenance/TROUBLESHOOTING.md)
2. Review existing [GitHub Issues](https://github.com/mevans2120/doa/issues)
3. Ask in team Slack channel
4. Consult technology-specific docs:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Sanity Docs](https://www.sanity.io/docs)
   - [Resend Docs](https://resend.com/docs)

## Next Steps

After setup is complete:
1. Familiarize yourself with the [project structure](#project-structure)
2. Review [Coding Standards](./CODING_STANDARDS.md)
3. Check out [Testing Guide](./TESTING.md)
4. Learn about [CMS Management](./CMS_MANAGEMENT.md)

---

Last Updated: December 2024