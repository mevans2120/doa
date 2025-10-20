# DOA CMS User Guide - Implementation Plan

## Executive Summary

This plan outlines the development of an internal documentation website for the DOA CMS User Guide. The guide will be built as a new route (`/cms-guide`) within the existing Next.js application, leveraging the current tech stack (Next.js 15, TypeScript, React 19, Tailwind CSS 4). The implementation follows a phased approach focusing on content authoring workflow, navigation, search functionality, and responsive design optimized for internal team use.

**Estimated Total Time:** 32-40 hours across 4 phases
**Target Completion:** 2-3 weeks with 2-3 developers
**Risk Level:** Low (isolated from main site, minimal dependencies)

---

## 1. Technical Architecture

### 1.1 Route Structure
- **Primary Route:** `/cms-guide`
- **Approach:** Nested route group within existing Next.js app
- **Rationale:** Keeps documentation in same deployment pipeline, shares design system, no subdomain complexity

### 1.2 File Structure
```
doa-website/
├── src/
│   ├── app/
│   │   └── cms-guide/                    # Documentation site route
│   │       ├── layout.tsx                # Guide-specific layout with sidebar
│   │       ├── page.tsx                  # Landing/overview page
│   │       ├── getting-started/
│   │       │   └── page.tsx              # Section 1
│   │       ├── how-things-work/
│   │       │   ├── page.tsx              # Section 2 overview
│   │       │   ├── images/page.tsx
│   │       │   ├── rich-text/page.tsx
│   │       │   ├── publishing/page.tsx
│   │       │   └── ordering/page.tsx
│   │       ├── content-types/
│   │       │   ├── page.tsx              # Section 3 overview
│   │       │   ├── projects/page.tsx
│   │       │   ├── services/page.tsx
│   │       │   ├── clients/page.tsx
│   │       │   ├── testimonials/page.tsx
│   │       │   ├── team-members/page.tsx
│   │       │   ├── about-page/page.tsx
│   │       │   ├── homepage/page.tsx
│   │       │   ├── site-settings/page.tsx
│   │       │   ├── email-settings/page.tsx
│   │       │   ├── contact-page/page.tsx
│   │       │   ├── services-page/page.tsx
│   │       │   └── projects-page/page.tsx
│   │       ├── common-tasks/
│   │       │   ├── page.tsx              # Section 4 overview
│   │       │   ├── rotating-content/page.tsx
│   │       │   ├── updating-contact/page.tsx
│   │       │   ├── seasonal-updates/page.tsx
│   │       │   └── campaigns/page.tsx
│   │       ├── troubleshooting/
│   │       │   └── page.tsx              # Section 5
│   │       ├── quick-reference/
│   │       │   └── page.tsx              # Section 6
│   │       └── getting-help/
│   │           └── page.tsx              # Section 7
│   ├── components/
│   │   └── cms-guide/                    # Guide-specific components
│   │       ├── GuideLayout.tsx           # Sidebar + content wrapper
│   │       ├── Sidebar.tsx               # Navigation sidebar
│   │       ├── TableOfContents.tsx       # Right-side TOC
│   │       ├── SearchBar.tsx             # Search component
│   │       ├── Breadcrumbs.tsx           # Navigation breadcrumbs
│   │       ├── CodeBlock.tsx             # Syntax highlighting
│   │       ├── InfoBox.tsx               # Tips, warnings, notes
│   │       ├── ImageSpec.tsx             # Image specification tables
│   │       ├── Checklist.tsx             # Interactive checklists
│   │       ├── VideoEmbed.tsx            # Video player wrapper
│   │       └── QuickLink.tsx             # Jump-to-section links
│   ├── lib/
│   │   └── cms-guide/
│   │       ├── navigation.ts             # Navigation structure/data
│   │       ├── search.ts                 # Search functionality
│   │       └── toc-generator.ts          # Auto-generate TOC from headings
│   └── types/
│       └── cms-guide.ts                  # TypeScript types for guide
└── public/
    └── cms-guide/                        # Static assets
        ├── screenshots/                  # CMS screenshots
        ├── videos/                       # Tutorial videos (if applicable)
        └── downloads/                    # PDF exports
```

### 1.3 Content Strategy: MDX
**Recommendation:** Use **MDX** (Markdown + JSX) for content authoring

**Rationale:**
- Markdown is non-technical-friendly (content editors can update)
- JSX components allow rich interactive elements (checklists, info boxes, tables)
- Version control through Git (track changes, rollback)
- No external CMS dependency (no Sanity overhead)
- Fast build times (static generation)

**Alternative Considered:** Sanity CMS
- **Rejected because:** Adds complexity, requires CMS maintenance, overkill for internal docs

### 1.4 Navigation Pattern
**Three-tier navigation system:**

1. **Left Sidebar** (Desktop) / Hamburger Menu (Mobile)
   - Primary navigation through sections
   - Expandable/collapsible subsections
   - Highlights current page
   - Sticky positioning

2. **Breadcrumbs** (Top of content)
   - Show current location in hierarchy
   - Clickable links to parent pages

3. **Table of Contents** (Right side, Desktop only)
   - Auto-generated from H2/H3 headings
   - Scroll-spy highlighting
   - Jump-to-section functionality

### 1.5 Search Functionality
**Recommendation:** Use **Pagefind** (self-hosted, zero-config)

**Why Pagefind:**
- Zero-config static site search
- No API keys or external services
- Runs at build time
- Small bundle size (~10kb)
- Works with Next.js static export

**Implementation:**
```bash
npm install pagefind
```

Add to build script in `package.json`:
```json
"scripts": {
  "build": "next build && npx pagefind --site out"
}
```

**Alternative:** Client-side search with Flexsearch
- Lighter weight but less powerful

### 1.6 Screenshot/Video Management
**Screenshots:**
- Store in `/public/cms-guide/screenshots/`
- Use Next.js `<Image>` component for optimization
- Naming convention: `{section}-{description}.png`
- Example: `projects-create-new.png`

**Videos:**
- Option 1: Host on Vimeo/YouTube (embed via iframe)
- Option 2: Self-host small MP4s in `/public/cms-guide/videos/`
- Recommendation: Vimeo for large files, self-host for <5MB clips

---

## 2. Phase-by-Phase Breakdown

### Phase 1: Foundation & Core Structure (8-10 hours)

#### Tasks:
1. **Set up MDX infrastructure** (2 hours)
   - Install `@next/mdx` and dependencies
   - Configure `next.config.ts` for MDX support
   - Create content parsing utilities
   - Set up TypeScript types

2. **Create base layout and routing** (2 hours)
   - Build `/cms-guide/layout.tsx` with sidebar structure
   - Create landing page `/cms-guide/page.tsx`
   - Set up responsive layout (mobile-first)
   - Implement dark mode support (match main site)

3. **Build navigation components** (3 hours)
   - `Sidebar.tsx` with collapsible sections
   - `Breadcrumbs.tsx` component
   - `TableOfContents.tsx` with scroll-spy
   - Navigation data structure in `/lib/cms-guide/navigation.ts`

4. **Create reusable content components** (2 hours)
   - `InfoBox.tsx` (tips, warnings, notes)
   - `CodeBlock.tsx` with syntax highlighting
   - `ImageSpec.tsx` table component
   - `Checklist.tsx` interactive component

5. **Style guide page** (1 hour)
   - Typography system
   - Color scheme (match DOA brand)
   - Component showcase page

**Deliverables:**
- Functional layout with sidebar navigation
- Empty route structure for all pages
- Reusable components library
- Design system documentation

---

### Phase 2: Content Migration (12-16 hours)

#### Tasks:
1. **Convert outline to MDX pages** (10-12 hours)
   - Section 1: Getting Started (1 hour)
   - Section 2: How Things Work (2 hours)
   - Section 3: Content Types (4-5 hours) - *largest section*
   - Section 4: Common Tasks (2 hours)
   - Section 5: Troubleshooting (1 hour)
   - Section 6: Quick Reference (1 hour)
   - Section 7: Getting Help (0.5 hour)

2. **Add screenshot placeholders** (2 hours)
   - Create placeholder images
   - Document screenshot requirements
   - Set up image optimization pipeline
   - Test responsive image loading

3. **Implement cross-linking** (1 hour)
   - Add internal links between sections
   - Create "Related Topics" component
   - Add "Next/Previous" page navigation

4. **Content review and editing** (1-2 hours)
   - Proofread all content
   - Ensure consistent formatting
   - Verify code examples
   - Test all links

**Deliverables:**
- Complete content in MDX format
- All pages accessible via navigation
- Placeholder screenshots in place
- Cross-linked documentation

---

### Phase 3: Search & Enhancement (6-8 hours)

#### Tasks:
1. **Implement search functionality** (3-4 hours)
   - Install and configure Pagefind
   - Create `SearchBar.tsx` component
   - Add search keyboard shortcuts (Cmd+K)
   - Style search results UI
   - Test search accuracy

2. **Add interactive elements** (2 hours)
   - Interactive checklists with localStorage persistence
   - Expandable code blocks
   - Copy-to-clipboard buttons
   - Zoom-in image lightbox

3. **Performance optimization** (1-2 hours)
   - Lazy load images below fold
   - Code-split large components
   - Implement route prefetching
   - Add loading states
   - Lighthouse audit and fixes

4. **Mobile optimization** (1 hour)
   - Test all pages on mobile devices
   - Optimize sidebar for mobile
   - Improve touch targets
   - Test search on mobile

**Deliverables:**
- Functional search with keyboard shortcuts
- Interactive components with state persistence
- Optimized performance (Lighthouse >90)
- Mobile-responsive design verified

---

### Phase 4: Polish & Production (6-8 hours)

#### Tasks:
1. **Capture and add real screenshots** (3-4 hours)
   - Log into Sanity CMS
   - Take screenshots for each section
   - Optimize images (WebP format)
   - Replace placeholders
   - Add alt text for accessibility

2. **Add video tutorials (optional)** (2 hours)
   - Record 2-3 key workflow videos
   - Upload to Vimeo
   - Embed in relevant pages
   - Add transcripts for accessibility

3. **SEO and metadata** (1 hour)
   - Add meta titles and descriptions
   - Create sitemap for guide pages
   - Add Open Graph images
   - Implement structured data

4. **Testing and QA** (1-2 hours)
   - Cross-browser testing
   - Accessibility audit (WCAG 2.1 AA)
   - Link checker
   - Spell check
   - User acceptance testing with content editors

5. **Documentation** (1 hour)
   - Create README for content editors
   - Document how to add new pages
   - Create style guide for MDX authoring
   - Add contribution guidelines

**Deliverables:**
- Production-ready guide with real screenshots
- Video tutorials embedded
- SEO optimized
- Fully tested and accessible
- Editor documentation complete

---

## 3. Technology Stack

### 3.1 Core Dependencies

```json
{
  "dependencies": {
    "@next/mdx": "^15.0.0",
    "@mdx-js/loader": "^3.0.0",
    "@mdx-js/react": "^3.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.0.0",
    "remark-gfm": "^4.0.0",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "pagefind": "^1.0.0"
  }
}
```

### 3.2 Navigation Data Structure

```typescript
// src/lib/cms-guide/navigation.ts
export interface NavItem {
  title: string
  href: string
  description?: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    href: '/cms-guide/getting-started',
    description: 'Quick 5-minute introduction to the CMS',
  },
  {
    title: 'How Things Work',
    href: '/cms-guide/how-things-work',
    children: [
      { title: 'Images', href: '/cms-guide/how-things-work/images' },
      { title: 'Rich Text', href: '/cms-guide/how-things-work/rich-text' },
      { title: 'Publishing', href: '/cms-guide/how-things-work/publishing' },
      { title: 'Ordering', href: '/cms-guide/how-things-work/ordering' },
    ],
  },
  // ... more sections
]
```

---

## 4. Content Authoring Workflow

### 4.1 Adding a New Page

**Step 1:** Create MDX file
```bash
touch src/app/cms-guide/new-section/page.mdx
```

**Step 2:** Add frontmatter metadata
```mdx
---
title: "New Section Title"
description: "Brief description"
lastUpdated: "2025-10-13"
---

# New Section Title

Your content here...
```

**Step 3:** Add to navigation
```typescript
// In src/lib/cms-guide/navigation.ts
{
  title: 'New Section',
  href: '/cms-guide/new-section',
}
```

**Step 4:** Use custom components
```mdx
<InfoBox type="tip">
This is a helpful tip.
</InfoBox>

<Checklist items={[
  'First task',
  'Second task'
]} />
```

### 4.2 Content Maintenance

**Version Control:**
- All content changes tracked via Git
- Commit convention: `docs(cms-guide): update projects section`
- Pull request review for major changes

**Update Schedule:**
- **Monthly:** Review FAQs
- **Quarterly:** Update screenshots
- **Annually:** Full content audit

---

## 5. Deployment Strategy

### 5.1 Integration with Main Site
- Guide lives at `/cms-guide` route
- Deployed with main site via Vercel
- Same build process (`npm run build`)
- Shares global styles and components

### 5.2 Build Process

```json
{
  "scripts": {
    "build": "next build && npx pagefind --site .next/static"
  }
}
```

### 5.3 Access Control (Optional)

Add `noindex` to prevent public search indexing:

```json
// vercel.json
{
  "headers": [
    {
      "source": "/cms-guide/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

---

## 6. Success Metrics

### Launch Criteria
- [ ] All 50+ pages accessible and functional
- [ ] Search returns accurate results
- [ ] Mobile navigation works smoothly
- [ ] All screenshots captured and optimized
- [ ] Lighthouse score >90
- [ ] Zero broken links
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] 2+ team members successfully use guide

### Post-Launch (30 days)
- **Usage:** 80% of team has visited guide
- **Engagement:** Average 5+ pages per session
- **Search:** <10% "no results" queries
- **Feedback:** 80%+ "helpful" ratings
- **Support:** 30% reduction in CMS questions

---

## 7. Resource Allocation

### Team Requirements

**Developer 1 (Lead):**
- Phase 1: Foundation (8-10 hours)
- Phase 3: Search & Enhancement (6-8 hours)
- **Total:** 14-18 hours

**Developer 2 (Content):**
- Phase 2: Content Migration (12-16 hours)
- Phase 4: Polish (3-4 hours)
- **Total:** 15-20 hours

**Designer/Content Editor:**
- Phase 2: Content review (2 hours)
- Phase 4: Screenshots (3-4 hours)
- **Total:** 5-6 hours

**QA/Testing:**
- Phase 4: Testing (2 hours)
- **Total:** 2 hours

### Timeline

**Week 1:** Phase 1-2 (Foundation + Content Migration started)
**Week 2:** Phase 2-3 (Content completed + Search)
**Week 3:** Phase 4 (Screenshots + Testing + Launch)

**Total:** 15 working days with 2-3 developers

---

## 8. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Content outdated after CMS updates | High | Medium | Quarterly review schedule |
| Search not accurate | Medium | Medium | Test early, improve keywords |
| Mobile navigation clunky | Low | Medium | Extensive mobile testing |
| Screenshots too large | Medium | Low | WebP format, lazy loading |
| MDX config issues | Low | High | Test setup early |

---

## 9. Implementation Checklist

### Pre-Development
- [ ] Review and approve plan
- [ ] Assign team members
- [ ] Set up project board
- [ ] Schedule kickoff meeting

### Phase 1: Foundation
- [ ] Install MDX dependencies
- [ ] Configure Next.js
- [ ] Create route structure
- [ ] Build navigation components
- [ ] Create reusable components

### Phase 2: Content Migration
- [ ] Convert outline to MDX
- [ ] Add placeholders
- [ ] Implement cross-linking
- [ ] Content review

### Phase 3: Search & Enhancement
- [ ] Implement Pagefind
- [ ] Add interactive elements
- [ ] Performance optimization
- [ ] Mobile testing

### Phase 4: Polish & Launch
- [ ] Capture screenshots
- [ ] Record videos (optional)
- [ ] SEO optimization
- [ ] Accessibility audit
- [ ] Launch to team

---

## 10. Future Considerations

### Phase 5: Advanced Features (Optional)

**PDF Export** (4 hours)
- Add "Download as PDF" button
- Use `react-pdf` or print CSS
- Cache generated PDFs

**Analytics** (2 hours)
- Track most-viewed pages
- Monitor search queries
- Use Vercel Analytics

**Interactive Demos** (8 hours)
- Embed Sanity Studio iframe
- Sandbox environment
- Guided tutorials

**Feedback Mechanism** (2 hours)
- "Was this helpful?" buttons
- Store in Vercel KV
- Review monthly

---

## Summary

This implementation plan provides a comprehensive roadmap for building the DOA CMS User Guide as a fully-integrated Next.js documentation site. The phased approach ensures steady progress while maintaining flexibility.

**Key Advantages:**
- No external dependencies (no CMS overhead)
- Version controlled (Git tracks all changes)
- Fast performance (static generation)
- Easy to maintain (Markdown + React)
- Scalable (add pages without code changes)
- Integrated deployment (ships with main site)

**Next Steps:**
1. Review and approve plan
2. Assign team members
3. Begin Phase 1 development
4. Schedule weekly check-ins

---

**Document Information:**
- **Created:** October 13, 2025
- **Version:** 1.0
- **Estimated Total Effort:** 32-40 hours
- **Target Completion:** 2-3 weeks
- **Source Outline:** `/memory-bank/CMS_USER_GUIDE_OUTLINE.md`
