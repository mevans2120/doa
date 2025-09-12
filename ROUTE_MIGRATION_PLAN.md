# Route Migration Plan

## Overview
Update all routes to match the new naming conventions for consistency across the site.

## Route Mapping

| Current Route | New Route | Display Name |
|--------------|-----------|--------------|
| `/projects` | `/our-work` | Our Work |
| `/services` | `/what-we-do` | What We Do |
| `/clients` | `/our-clients` | Our Clients |
| `/about` | `/about` | About (no change) |
| `/contact` | `/contact` | Contact (no change) |

## Implementation Steps

### 1. Rename App Folders
Move the following folders in `/src/app/`:
```bash
mv src/app/projects src/app/our-work
mv src/app/services src/app/what-we-do
mv src/app/clients src/app/our-clients
```

### 2. Update Header Component
File: `/src/components/Header.tsx`

Update navigation links:
- Line 87: `href="/projects"` → `href="/our-work"`
- Line 96: `href="/services"` → `href="/what-we-do"`
- Line 105: `href="/clients"` → `href="/our-clients"`

### 3. Update Footer Component
File: `/src/components/Footer.tsx`

Update Quick Links section:
- Line 81: `href="/projects"` → `href="/our-work"`
- Line 82: `href="/services"` → `href="/what-we-do"`
- Line 83: `href="/clients"` → `href="/our-clients"`

### 4. Check Internal Links
Review and update any internal links in:
- `/src/app/page.tsx` - Homepage (check for any CTAs or links)
- Any other components that might reference these routes

### 5. Add Redirects (Recommended)
Add redirects in `/next.config.ts` to prevent broken links:

```typescript
async redirects() {
  return [
    {
      source: '/projects',
      destination: '/our-work',
      permanent: true,
    },
    {
      source: '/services',
      destination: '/what-we-do',
      permanent: true,
    },
    {
      source: '/clients',
      destination: '/our-clients',
      permanent: true,
    },
  ]
}
```

## Testing Checklist

After implementation, verify:
- [ ] `/our-work` loads the projects page
- [ ] `/what-we-do` loads the services page
- [ ] `/our-clients` loads the clients page
- [ ] Navigation menu links work correctly
- [ ] Footer Quick Links work correctly
- [ ] Old URLs redirect to new ones (if redirects added)
- [ ] No console errors or 404s
- [ ] Mobile menu works with new routes

## Rollback Plan

If issues arise, revert by:
1. Rename folders back to original names
2. Revert Header.tsx changes
3. Revert Footer.tsx changes
4. Remove redirects from next.config.ts

## Notes

- The route change maintains all functionality while improving consistency
- Consider setting up redirects to preserve any existing bookmarks or external links
- Update sitemap.xml if one exists
- Update any documentation that references the old routes