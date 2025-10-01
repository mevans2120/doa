# Department of Art Documentation

Welcome to the Department of Art website documentation. This documentation is organized to help developers, designers, and content managers understand and maintain the project effectively.

## 📚 Documentation Structure

### [Architecture](./architecture/)
Technical decisions, system design, and infrastructure documentation.
- [Technical Stack](./architecture/TECH_STACK.md) - Technologies and frameworks used
- [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md) - High-level system design
- [Data Flow](./architecture/DATA_FLOW.md) - How data moves through the application
- [Design Decisions](./architecture/DESIGN_DECISIONS.md) - Key architectural decisions and rationale

### [Guides](./guides/)
Step-by-step guides for common tasks.
- [Development Setup](./guides/DEVELOPMENT_SETUP.md) - Getting started with local development
- [CMS Management](./guides/CMS_MANAGEMENT.md) - Managing content in Sanity
- [Testing Guide](./guides/TESTING.md) - Running and writing tests
- [Styling Guide](./guides/STYLING.md) - CSS and design system guidelines

### [API](./api/)
API documentation and integration guides.
- [API Routes](./api/ROUTES.md) - Next.js API endpoints
- [Sanity Queries](./api/SANITY_QUERIES.md) - GROQ queries and data fetching
- [Email Integration](./api/EMAIL_INTEGRATION.md) - Resend email service documentation
- [Environment Variables](./api/ENVIRONMENT_VARS.md) - Required configuration

### [Maintenance](./maintenance/)
Operational guides and runbooks.
- [Deployment](./maintenance/DEPLOYMENT.md) - Deploying to production
- [Monitoring](./maintenance/MONITORING.md) - Error tracking and performance monitoring
- [Troubleshooting](./maintenance/TROUBLESHOOTING.md) - Common issues and solutions
- [Updates & Migrations](./maintenance/MIGRATIONS.md) - Database and content migrations

## 🚀 Quick Links

- **For Developers**: Start with [Development Setup](./guides/DEVELOPMENT_SETUP.md)
- **For Content Managers**: See [CMS Management](./guides/CMS_MANAGEMENT.md)
- **For DevOps**: Check [Deployment](./maintenance/DEPLOYMENT.md) and [Monitoring](./maintenance/MONITORING.md)

## 📋 Project Overview

The Department of Art website is a Next.js application with:
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **CMS**: Sanity Studio for content management
- **Email**: Resend for contact form submissions
- **Testing**: Jest for unit tests, Playwright for E2E tests
- **Deployment**: Vercel (recommended)

## 🔑 Key Features

1. **Dynamic Content Management** - All content managed through Sanity CMS
2. **Responsive Design** - Mobile-first, fully responsive layouts
3. **Performance Optimized** - Image optimization, lazy loading, static generation
4. **SEO Ready** - Dynamic meta tags, structured data, sitemap
5. **Contact Form** - Email integration with rate limiting and validation

## 📝 Documentation Standards

When updating documentation:
1. Use clear, concise language
2. Include code examples where relevant
3. Keep screenshots up-to-date
4. Version-specific information should be noted
5. Add timestamps to time-sensitive content

## 🤝 Contributing to Docs

To improve documentation:
1. Follow the existing structure
2. Update the relevant index when adding new files
3. Cross-link related documentation
4. Review for accuracy before committing

## 📞 Support

For questions not covered in documentation:
- Check existing [GitHub Issues](https://github.com/mevans2120/doa/issues)
- Review [Troubleshooting Guide](./maintenance/TROUBLESHOOTING.md)
- Contact the development team

---

Last Updated: December 2024
Version: 1.0.0