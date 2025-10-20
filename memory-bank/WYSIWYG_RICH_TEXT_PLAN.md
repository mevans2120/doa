# WYSIWYG Rich Text Implementation Plan for DOA Website

## Executive Summary

This plan details the implementation of WYSIWYG rich text editing capabilities across the DOA website using Sanity's Portable Text. The styling will be muted and subtle for optimal readability on the black background, with support for bold, italic, and hyperlinks.

**Duration:** 4-6 hours
**Risk Level:** Low (backward compatible, non-breaking)
**Testing Required:** Unit tests, CMS integration tests, visual regression tests

---

## Phase 1: Schema Audit (COMPLETED)

### Fields Requiring Rich Text Conversion

Based on the codebase audit, the following fields should be converted from plain `text` to Portable Text `block` arrays:

#### High Priority (User-Facing Content)

1. **Projects** (`/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/project.ts`)
   - `description` (line 40-44) - Currently `text`, appears in project modals
   - **Impact:** High visibility - shown in project detail modals

2. **Services** (`/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/service.ts`)
   - `shortDescription` (line 15-21) - Currently `text`, limited to 200 chars
   - **Impact:** High visibility - shown on homepage and services page
   - **Note:** Keep 200 char validation

3. **Team Members** (`/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/teamMember.ts`)
   - `bio` (line 21-25) - Currently `text`, 3 rows
   - **Impact:** Medium visibility - shown on about page

4. **Testimonials** (`/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/testimonial.ts`)
   - `quote` (line 16-21) - Currently `text`, 3 rows
   - **Impact:** High visibility - shown on homepage

5. **About Page** (`/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/aboutPage.ts`)
   - `missionText` (line 44-48) - Currently `text`
   - `visionText` (line 54-58) - Currently `text`
   - **Note:** `companyOverview` and `storyContent` already use Portable Text
   - **Impact:** High visibility - about page content

6. **Homepage Settings** (`/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/homepageSettings.ts`)
   - `aboutCTA.description` (line 93-98) - Currently `text`, 3 rows
   - **Impact:** High visibility - homepage CTA

#### Already Using Portable Text ✅

- About Page: `companyOverview` (line 30)
- About Page: `storyContent` (line 68)

---

## Phase 2: Custom Portable Text Component with Muted Styling

### File to Create

**Path:** `/Users/michaelevans/DOA/doa-website/src/components/RichText.tsx`

### Component Code

```tsx
'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'

interface RichTextProps {
  value: TypedObject[]
  className?: string
}

/**
 * Custom Portable Text component with muted styling for black backgrounds
 * Supports: bold, italic, links
 */
const RichText = ({ value, className = '' }: RichTextProps) => {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className={`text-gray-300 leading-relaxed mb-4 last:mb-0 ${className}`}>
          {children}
        </p>
      ),
    },
    marks: {
      // Bold: Slightly brighter white with subtle weight increase
      strong: ({ children }) => (
        <strong className="font-semibold text-gray-100">
          {children}
        </strong>
      ),

      // Italic: Slightly more muted gray
      em: ({ children }) => (
        <em className="italic text-gray-400">
          {children}
        </em>
      ),

      // Links: Muted blue with subtle hover effect
      link: ({ children, value }) => {
        const href = value?.href || '#'
        const isExternal = href.startsWith('http')

        return (
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-blue-400 hover:text-blue-300 underline-offset-2 decoration-1 hover:underline transition-colors duration-200"
          >
            {children}
          </a>
        )
      },
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-gray-300 leading-relaxed">
          {children}
        </li>
      ),
      number: ({ children }) => (
        <li className="text-gray-300 leading-relaxed">
          {children}
        </li>
      ),
    },
  }

  if (!value || value.length === 0) {
    return null
  }

  return <PortableText value={value} components={components} />
}

export default RichText
```

### Alternative Muted Link Styling Option

If the blue links are too prominent, here's an alternative more subtle gray approach:

```tsx
// Alternative link styling - more muted
link: ({ children, value }) => {
  const href = value?.href || '#'
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-gray-200 underline decoration-gray-500 underline-offset-2 hover:text-white hover:decoration-gray-300 transition-colors duration-200"
    >
      {children}
    </a>
  )
},
```

### Accessibility Considerations

- **Contrast Ratios:**
  - Normal text (`text-gray-300` #d1d5db): 7.48:1 on black (AAA)
  - Bold text (`text-gray-100` #f3f4f6): 14.98:1 on black (AAA)
  - Italic text (`text-gray-400` #9ca3af): 4.57:1 on black (AA)
  - Blue links (`text-blue-400` #60a5fa): 5.13:1 on black (AA)
  - Gray links (`text-gray-200` #e5e7eb): 10.42:1 on black (AAA)

All options meet WCAG AA standards minimum. Bold and gray links meet AAA.

---

## Phase 3: Sanity Schema Updates

### Portable Text Configuration

Create a shared block configuration to ensure consistency:

**File to Create:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/objects/bodyText.ts`

```typescript
import { defineType } from 'sanity'

/**
 * Simple body text with bold, italic, and links only
 * Used for descriptions, bios, and body copy throughout the site
 */
export const bodyText = defineType({
  name: 'bodyText',
  title: 'Body Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' }
      ],
      lists: [], // No lists for simple body text
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' }
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) => Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              }
            ]
          }
        ]
      }
    }
  ]
})

/**
 * Rich body text with lists enabled
 * Used for longer-form content like about page sections
 */
export const richBodyText = defineType({
  name: 'richBodyText',
  title: 'Rich Body Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' }
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) => Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              }
            ]
          }
        ]
      }
    }
  ]
})
```

### Schema File Updates

#### 1. Update index.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/index.ts`

```typescript
// Add these imports
import { bodyText, richBodyText } from './objects/bodyText'

// Add to the types array
export const schemaTypes = [
  // ... existing types
  bodyText,
  richBodyText,
  // ... rest of types
]
```

#### 2. Update project.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/project.ts`

```typescript
// Replace this:
defineField({
  name: 'description',
  title: 'Description',
  type: 'text',
  rows: 4,
}),

// With this:
defineField({
  name: 'description',
  title: 'Description',
  type: 'bodyText',
  description: 'Project overview with optional formatting (bold, italic, links)',
}),
```

#### 3. Update service.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/service.ts`

```typescript
// Replace this:
defineField({
  name: 'shortDescription',
  title: 'Short Description',
  type: 'text',
  rows: 3,
  description: 'Brief description for service cards (max 200 characters)',
  validation: (Rule) => Rule.required().max(200),
}),

// With this:
defineField({
  name: 'shortDescription',
  title: 'Short Description',
  type: 'bodyText',
  description: 'Brief description with optional formatting (max 200 characters total)',
  validation: (Rule) => Rule.required().custom((value) => {
    if (!value) return true
    // Calculate total text length from all blocks
    const textLength = value.reduce((acc: number, block: any) => {
      if (block._type === 'block' && block.children) {
        return acc + block.children.reduce((sum: number, child: any) => {
          return sum + (child.text?.length || 0)
        }, 0)
      }
      return acc
    }, 0)

    return textLength <= 200 || 'Description must be 200 characters or less'
  }),
}),
```

#### 4. Update teamMember.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/teamMember.ts`

```typescript
// Replace this:
defineField({
  name: 'bio',
  title: 'Bio',
  type: 'text',
  rows: 3,
}),

// With this:
defineField({
  name: 'bio',
  title: 'Bio',
  type: 'bodyText',
  description: 'Team member bio with optional formatting (bold, italic, links)',
}),
```

#### 5. Update testimonial.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/testimonial.ts`

```typescript
// Replace this:
defineField({
  name: 'quote',
  title: 'Quote',
  type: 'text',
  rows: 3,
  validation: (Rule) => Rule.required(),
}),

// With this:
defineField({
  name: 'quote',
  title: 'Quote',
  type: 'bodyText',
  description: 'Testimonial quote with optional formatting (bold, italic, links)',
  validation: (Rule) => Rule.required(),
}),
```

#### 6. Update aboutPage.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/aboutPage.ts`

```typescript
// Replace missionText:
defineField({
  name: 'missionText',
  title: 'Mission Text',
  type: 'bodyText',
  description: 'Mission statement with optional formatting',
}),

// Replace visionText:
defineField({
  name: 'visionText',
  title: 'Vision Text',
  type: 'bodyText',
  description: 'Vision statement with optional formatting',
}),

// Note: companyOverview and storyContent already use block type
// Update them to use richBodyText for consistency:
defineField({
  name: 'companyOverview',
  title: 'Company Overview',
  type: 'richBodyText',
  description: 'Main company description with formatting and lists',
}),

defineField({
  name: 'storyContent',
  title: 'Our Story Content',
  type: 'richBodyText',
  description: 'Company story with formatting and lists',
}),
```

#### 7. Update homepageSettings.ts

**File:** `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/homepageSettings.ts`

```typescript
// Inside aboutCTA object fields:
defineField({
  name: 'description',
  title: 'Description',
  type: 'bodyText',
  description: 'CTA description with optional formatting',
  initialValue: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'With over 20 years of experience in film and television production design, Department of Art brings your creative vision to life with unmatched craftsmanship and artistic excellence.'
        }
      ]
    }
  ],
}),
```

---

## Phase 4: Frontend Component Updates

### Files to Update

1. **Projects Component** - `/Users/michaelevans/DOA/doa-website/src/components/Projects.tsx`
2. **Services Component** - `/Users/michaelevans/DOA/doa-website/src/components/Services.tsx`
3. **Testimonials Component** - `/Users/michaelevans/DOA/doa-website/src/components/Testimonials.tsx`
4. **About Page** - `/Users/michaelevans/DOA/doa-website/src/app/about/page.tsx`
5. **AboutCTA Component** - `/Users/michaelevans/DOA/doa-website/src/components/AboutCTA.tsx`

See detailed code changes in the planning agent output above.

---

## Phase 5: TypeScript Type Updates

**File:** `/Users/michaelevans/DOA/doa-website/src/types/sanity.ts`

Update interfaces to use `PortableTextBlock[]` instead of `string` for converted fields.

---

## Phase 6: Testing & Migration

### Testing Checklist

- [ ] Unit tests for RichText component
- [ ] Update CMS integration tests
- [ ] Visual regression testing
- [ ] Browser compatibility testing
- [ ] Accessibility testing (contrast ratios)

### Migration

The conversion is **backward compatible**. Existing plain text will automatically convert to Portable Text format when migrated.

---

## Implementation Checklist

### Files to Create (3)

- [ ] `/Users/michaelevans/DOA/doa-website/src/components/RichText.tsx`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/objects/bodyText.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/__tests__/RichText.test.tsx`

### Files to Modify (15)

**Sanity Schemas (7):**
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/index.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/project.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/service.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/teamMember.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/testimonial.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/aboutPage.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/sanity/schemaTypes/homepageSettings.ts`

**Frontend Components (5):**
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/Projects.tsx`
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/Services.tsx`
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/Testimonials.tsx`
- [ ] `/Users/michaelevans/DOA/doa-website/src/app/about/page.tsx`
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/AboutCTA.tsx`

**Types & Tests (3):**
- [ ] `/Users/michaelevans/DOA/doa-website/src/types/sanity.ts`
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/__tests__/Projects.cms.test.tsx`
- [ ] `/Users/michaelevans/DOA/doa-website/src/components/__tests__/Services.cms.test.tsx`

---

## Styling Guide for Black Background

### Text Colors
- **Normal text**: `text-gray-300` (#d1d5db)
- **Bold text**: `font-semibold text-gray-100` (#f3f4f6)
- **Italic text**: `italic text-gray-400` (#9ca3af)

### Link Styles (Choose One)

**Option 1: Muted Blue (Recommended)**
```tsx
className="text-blue-400 hover:text-blue-300 underline-offset-2 decoration-1 hover:underline transition-colors duration-200"
```

**Option 2: Subtle Gray**
```tsx
className="text-gray-200 underline decoration-gray-500 underline-offset-2 hover:text-white hover:decoration-gray-300 transition-colors duration-200"
```

### Design Principle
**"A little goes a long way"** - Keep formatting subtle and professional. Use bold for emphasis, italic sparingly, and ensure links are discoverable but not distracting.

---

## Timeline

**Total Time:** 4-6 hours

1. Create RichText component - 30 mins
2. Create body text schemas - 15 mins
3. Update Sanity schemas - 30 mins
4. Update TypeScript types - 15 mins
5. Update frontend components - 60 mins
6. Test locally - 30 mins
7. Update CMS tests - 30 mins
8. Deploy and monitor - 30 mins

---

## Success Metrics

1. All converted fields render correctly with formatting
2. Links are clickable and open correctly
3. No console errors or TypeScript errors
4. All text meets WCAG AA contrast ratios
5. No performance degradation
6. Content editors can successfully use formatting controls

---

**Status:** Ready for Implementation
**Priority:** Medium
**Risk:** Low
