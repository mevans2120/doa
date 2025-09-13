# CMS Integration Plan

## Overview
Complete integration of Sanity CMS for all content management needs on the DOA website.

## Completed ✅

### Phase 1: Homepage Content Management
- ✅ Created homepage settings schema
- ✅ Updated Hero component to fetch from Sanity
- ✅ Updated all section titles to be editable
- ✅ Updated AboutCTA component for dynamic content
- ✅ Implemented HomepageContext for data sharing

## Remaining Tasks

### Phase 2: Services Content Management
1. **Create Service Schema in Sanity**
   - Title, slug, description, icon selection
   - Order field for sorting
   - Category field for grouping

2. **Migrate Static Services to Sanity**
   - 13 existing services to migrate:
     - Graphic Renderings
     - Set Construction
     - Scenic Treatments
     - Custom Welding
     - Trade Show Displays
     - Retail Fixtures
     - Crating Services
     - Materials Handling Equipment
     - Art Department Crew
     - Shop Rental
     - Office/Internet Rental
     - Truck Rental and Supplies
     - F/X Supplies and Rentals

3. **Update Components**
   - Services component to fetch from Sanity
   - Create individual service detail pages
   - Add service icons management

### Phase 3: Contact Form Implementation with Resend
1. **Setup Resend Integration**
   - Install Resend SDK
   - Configure API keys in environment variables
   - Create email templates with React Email

2. **Create Contact Form API Route**
   - `/api/contact` endpoint
   - Form validation
   - Rate limiting
   - Spam protection (honeypot/reCAPTCHA)

3. **Update Contact Page**
   - Implement form with validation
   - Success/error handling
   - Loading states

### Phase 4: SEO & Metadata
1. **Dynamic Meta Tags**
   - Implement generateMetadata for all pages
   - Use SEO fields from Sanity
   - Open Graph image support

2. **Sitemap Generation**
   - Dynamic sitemap.xml
   - Include all CMS content

### Phase 5: Route Updates
1. **Rename Routes** (per ROUTE_MIGRATION_PLAN.md)
   - `/projects` → `/our-work`
   - `/services` → `/what-we-do`
   - `/clients` → `/our-clients`

2. **Add Redirects**
   - Configure 301 redirects in next.config.ts
   - Preserve SEO and bookmarks

### Phase 6: Additional Enhancements
1. **Image Optimization**
   - Implement Sanity's image pipeline
   - Responsive images
   - Lazy loading

2. **Search Functionality**
   - Full-text search across content
   - Filter by content type

3. **Content Management Features**
   - Preview draft content
   - Content versioning
   - User roles and permissions

## Tech Stack Decisions

### Email Service: Resend
- **Reason**: Best developer experience, modern API, excellent Next.js integration
- **Free Tier**: 3,000 emails/month
- **Features**: React Email templates, webhooks, analytics

### Form Protection
- **Primary**: Honeypot field
- **Secondary**: Rate limiting with Upstash Redis (if needed)
- **Optional**: reCAPTCHA v3 for high-traffic scenarios

## Next Steps Priority
1. Services Content Management (Phase 2)
2. Contact Form with Resend (Phase 3)
3. Route Updates (Phase 5)
4. SEO Implementation (Phase 4)
5. Additional Enhancements (Phase 6)

## Environment Variables Needed
```env
# Resend (to be added)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@departmentofart.com

# Already configured
NEXT_PUBLIC_SANITY_PROJECT_ID=vc89ievx
NEXT_PUBLIC_SANITY_DATASET=production
```

## Success Metrics
- [ ] All content editable through Sanity Studio
- [ ] Contact form functional with email notifications
- [ ] SEO optimized with dynamic meta tags
- [ ] Routes updated for consistency
- [ ] Zero hardcoded content in components