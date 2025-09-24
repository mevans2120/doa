# Sanity CMS Integration Plan for DOA Website

## Overview
This document outlines the plan for integrating Sanity CMS with the Department of Art (DOA) website to enable content management capabilities for non-technical users.

## 1. Project Setup

### 1.1 Sanity Studio Setup
- Create a new Sanity project using `npm create sanity@latest`
- Choose project name: `doa-studio`
- Select dataset: `production` (with optional `development` for testing)
- Configure CORS origins for localhost and production domain
- Set up project structure within the Next.js monorepo or as separate repository

### 1.2 Next.js Integration
- Install Sanity client: `npm install @sanity/client @sanity/image-url`
- Install Next.js Sanity toolkit: `npm install next-sanity`
- Configure environment variables:
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
  NEXT_PUBLIC_SANITY_DATASET=production
  SANITY_API_TOKEN=your_token (for preview/draft mode)
  ```

## 2. Content Schema Design

### 2.1 Project Schema
```javascript
{
  name: 'project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'client', type: 'string' },
    { name: 'category', type: 'string', options: { 
      list: ['Film & Television', 'Commercial', 'Music Video', 'Other'] 
    }},
    { name: 'featured', type: 'boolean', default: false },
    { name: 'mainImage', type: 'image', options: { hotspot: true } },
    { name: 'gallery', type: 'array', of: [{ type: 'image' }] },
    { name: 'description', type: 'text' },
    { name: 'services', type: 'array', of: [{ type: 'string' }] },
    { name: 'completionDate', type: 'date' },
    { name: 'order', type: 'number' }
  ]
}
```

### 2.2 Client/Partner Schema
```javascript
{
  name: 'client',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'logo', type: 'image' },
    { name: 'logoWhite', type: 'image' }, // For dark backgrounds
    { name: 'website', type: 'url' },
    { name: 'featured', type: 'boolean', default: false },
    { name: 'order', type: 'number' }
  ]
}
```

### 2.3 Testimonial Schema
```javascript
{
  name: 'testimonial',
  type: 'document',
  fields: [
    { name: 'quote', type: 'text', validation: Rule => Rule.required() },
    { name: 'author', type: 'string', validation: Rule => Rule.required() },
    { name: 'role', type: 'string' },
    { name: 'company', type: 'string' },
    { name: 'featured', type: 'boolean', default: false },
    { name: 'order', type: 'number' }
  ]
}
```

### 2.4 Service Schema
```javascript
{
  name: 'service',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'shortDescription', type: 'text' },
    { name: 'fullDescription', type: 'array', of: [{ type: 'block' }] },
    { name: 'icon', type: 'image' },
    { name: 'order', type: 'number' }
  ]
}
```

### 2.5 Team Member Schema
```javascript
{
  name: 'teamMember',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'role', type: 'string' },
    { name: 'bio', type: 'text' },
    { name: 'photo', type: 'image', options: { hotspot: true } },
    { name: 'order', type: 'number' }
  ]
}
```

### 2.6 Global Settings Schema
```javascript
{
  name: 'siteSettings',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'heroTitle', type: 'string' },
    { name: 'heroSubtitle', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'string' },
    { name: 'address', type: 'text' },
    { name: 'socialMedia', type: 'object', fields: [
      { name: 'instagram', type: 'url' },
      { name: 'linkedin', type: 'url' },
      { name: 'vimeo', type: 'url' }
    ]}
  ]
}
```

## 3. Data Fetching Strategy

### 3.1 Create Sanity Client
```typescript
// lib/sanity.client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
```

### 3.2 GROQ Queries
```typescript
// lib/sanity.queries.ts
export const projectsQuery = `*[_type == "project"] | order(order asc, _createdAt desc) {
  _id,
  title,
  slug,
  client,
  category,
  mainImage,
  description,
  featured
}`

export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(order asc) [0...6]`

export const clientsQuery = `*[_type == "client"] | order(order asc, name asc)`

export const testimonialsQuery = `*[_type == "testimonial" && featured == true] | order(order asc)`
```

### 3.3 Image URL Builder
```typescript
// lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

## 4. Component Migration Plan

### Phase 1: Static Data Migration (Week 1)
1. **Projects Component**
   - Replace hardcoded projects array with Sanity query
   - Implement dynamic image loading
   - Add loading states

2. **ClientLogos Component**
   - Migrate client logos to Sanity
   - Implement dynamic logo rendering
   - Add proper alt text from CMS

3. **Testimonials Component**
   - Move testimonials to Sanity
   - Add ability to feature/unfeature testimonials
   - Implement ordering

### Phase 2: Page Migration (Week 2)
1. **Projects Page** (`/projects`)
   - Full project gallery with filtering
   - Individual project detail pages
   - Dynamic routing with slugs

2. **Clients Page** (`/clients`)
   - Complete client list from CMS
   - Click-through to client websites
   - Logo optimization

3. **About Page** (`/about`)
   - Team members from CMS
   - Company history/timeline
   - Dynamic content blocks

### Phase 3: Global Content (Week 3)
1. **Hero Component**
   - Editable hero text
   - Background image management
   - CTA customization

2. **Footer Component**
   - Dynamic contact information
   - Social media links
   - Office locations

3. **SEO & Metadata**
   - Page-specific metadata
   - Open Graph images
   - Sitemap generation

## 5. Preview Mode Implementation

### 5.1 Preview API Route
```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()
  redirect(slug || '/')
}
```

### 5.2 Exit Preview Route
```typescript
// app/api/exit-preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  draftMode().disable()
  redirect('/')
}
```

## 6. Deployment & Infrastructure

### 6.1 Sanity Studio Deployment
- Deploy Studio to Vercel/Netlify at `studio.departmentofart.com`
- Configure authentication (Google, GitHub, or email)
- Set up user roles and permissions

### 6.2 Webhook Configuration
- Set up revalidation webhooks for content updates
- Configure Next.js ISR (Incremental Static Regeneration)
- Implement on-demand revalidation

### 6.3 CDN & Image Optimization
- Leverage Sanity's built-in CDN
- Implement responsive images with Next.js Image component
- Set up image transformations (crop, quality, format)

## 7. Content Migration

### 7.1 Initial Data Import
1. Export existing content to JSON
2. Transform to match Sanity schemas
3. Import using Sanity CLI or API
4. Verify data integrity

### 7.2 Asset Migration
1. Upload existing images to Sanity
2. Update references in documents
3. Implement redirects for old URLs

## 8. Training & Documentation

### 8.1 Editor Training
- Create user guides for content editors
- Document workflow for adding projects
- Provide image optimization guidelines

### 8.2 Developer Documentation
- API reference for custom queries
- Component integration examples
- Troubleshooting guide

## 9. Testing Strategy

### 9.1 Unit Tests
- Test Sanity queries
- Validate schema types
- Image URL generation

### 9.2 Integration Tests
- Preview mode functionality
- Webhook revalidation
- Data fetching edge cases

### 9.3 E2E Tests
- Content publishing workflow
- Image upload and display
- Search and filtering

## 10. Performance Considerations

### 10.1 Caching Strategy
- Implement ISR with 60-second revalidation
- Use Next.js Data Cache for queries
- Browser caching for static assets

### 10.2 Query Optimization
- Limit field projection in GROQ
- Implement pagination for large datasets
- Use references instead of embedded documents

### 10.3 Bundle Size
- Lazy load Sanity preview components
- Tree-shake unused Sanity modules
- Optimize client-side JavaScript

## 11. Security Measures

### 11.1 API Security
- Secure API tokens in environment variables
- Implement CORS properly
- Rate limiting for API routes

### 11.2 Content Security
- Sanitize user-generated content
- Validate image uploads
- Implement proper authentication

## 12. Timeline & Milestones

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| 1 | Setup & Schema Design | Sanity project, schemas defined |
| 2 | Phase 1 Components | Projects, Clients, Testimonials migrated |
| 3 | Phase 2 Pages | All pages using CMS data |
| 4 | Phase 3 & Preview | Global content, preview mode |
| 5 | Testing & Migration | Content imported, tests written |
| 6 | Training & Launch | Documentation, go-live |

## 13. Estimated Costs

- **Sanity Free Tier**: Suitable for start (3 users, 100k API requests/month)
- **Sanity Team Plan**: $99/month (10 users, 500k API requests)
- **Development Time**: ~120 hours
- **Training/Documentation**: ~20 hours

## 14. Success Metrics

- Content update time reduced by 90%
- Zero developer involvement for content changes
- Page load performance maintained or improved
- SEO rankings maintained or improved
- Editor satisfaction score > 4/5

## 15. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content migration errors | High | Comprehensive testing, staged rollout |
| Performance degradation | Medium | Caching strategy, monitoring |
| Editor adoption | Medium | Training sessions, documentation |
| API rate limits | Low | Implement caching, upgrade plan if needed |

## Next Steps

1. Review and approve plan with stakeholders
2. Set up Sanity project and development environment
3. Begin Phase 1 implementation
4. Schedule training sessions for content editors
5. Plan content migration strategy

---

*This plan is designed to be iterative and can be adjusted based on feedback and requirements as the project progresses.*