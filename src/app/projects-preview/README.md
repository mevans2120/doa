# Projects Preview - Three Design Versions

This preview page showcases three distinct design approaches for displaying project portfolios, each with all images displayed inline (no modal popups).

## Overview

**Location**: `/projects-preview`

Access the preview at: `http://localhost:3000/projects-preview` (development) or `https://yourdomain.com/projects-preview` (production)

## Three Design Versions

### 1. Minimal Version

**Philosophy**: Less is more. Maximum whitespace, minimal styling, elegant simplicity.

**Design Characteristics**:
- Clean, airy layout with generous spacing (48 units between projects)
- Light typography with thin weights
- Monospace project numbers for subtle hierarchy
- Varying image widths (100%, 85%, 70%) with asymmetric alignment
- Single-column layout for focused viewing
- Minimal color palette (white, gray tones)
- Simple image counters for navigation context

**Best For**:
- Sophisticated, gallery-like presentations
- Projects where imagery should be the sole focus
- Clients seeking understated elegance
- High-end portfolio presentations

### 2. Punk Rock Version

**Philosophy**: Raw energy, rebellion, controlled chaos. Break the rules.

**Design Characteristics**:
- Bold, aggressive typography with heavy weights
- High-contrast color accents (red, yellow, green, purple, cyan, pink)
- Chaotic grid with rotated elements (-3° to +3°)
- Graffiti-style project headers with colored borders
- Grayscale-to-color image hover effects
- Grungy background textures
- Overlapping, asymmetric layouts
- Stamp-style image numbering on hover

**Best For**:
- Creative, edgy projects
- Youth-oriented or alternative brands
- Projects needing high visual energy
- Standing out from conventional portfolios

### 3. Design System Aligned Version

**Philosophy**: Consistency with existing brand. Familiar patterns, professional execution.

**Design Characteristics**:
- Uses existing CSS classes (`page-title`, `heading-font`, `professional-divider`)
- Matches current site's color scheme (zinc grays, subtle borders)
- Hero image treatment (16:9 aspect) followed by 3-column grid
- Hover effects consistent with current site (scale, brightness, shadow)
- Professional card styling with rounded corners and borders
- Smooth transitions and animations (fade-in-up)
- Responsive breakpoints matching site standards

**Best For**:
- Production-ready implementation
- Maintaining brand consistency
- Clients expecting familiar navigation patterns
- Enterprise or corporate presentations

## Technical Implementation

### Data Structure

All versions consume the same Sanity CMS data:

```typescript
interface ProjectData {
  _id: string;
  title: string;
  description: string;
  mainImage?: ImageAsset;
  gallery?: ImageAsset[];
  client?: string;
  year?: number;
}
```

### Image Handling

- **Minimal**: 1600px width for high-quality single-column display
- **Punk Rock**: 1200px width, grayscale with color on hover
- **Design System**: 1600px for hero, 800px for grid thumbnails

All versions use Next.js `Image` component with proper:
- `fill` layout for responsive containers
- Optimized `sizes` attribute for performance
- Lazy loading (except first project hero image)

### Responsive Behavior

#### Minimal Version
- Mobile: Full-width stacked layout
- Tablet/Desktop: Varying widths with asymmetric positioning

#### Punk Rock Version
- Mobile: Simplified grid (fewer columns)
- Tablet: 6-column grid with adapted layouts
- Desktop: Full 12-column chaotic grid

#### Design System Version
- Mobile: Single column (100vw)
- Tablet: 2 columns (50vw each)
- Desktop: 3 columns (33vw each)

## Navigation

The preview page includes a sticky navigation bar at the top with jump links:

- **Minimal** → Jumps to `#minimal`
- **Punk Rock** → Jumps to `#punk`
- **Design System** → Jumps to `#system`

Each section is separated by thick borders (8px) for clear visual distinction.

## Design Decisions

### Minimal Version
1. **Asymmetric widths**: Creates visual interest while maintaining simplicity
2. **Monospace counters**: Adds subtle technical aesthetic
3. **Single column**: Forces focused attention on each image
4. **Light fonts**: Reduces visual weight, lets images dominate

### Punk Rock Version
1. **Color rotation**: 6 accent colors cycle through for variety
2. **Rotation angles**: Subtle tilts (-3° to +3°) create energy without chaos
3. **Grayscale default**: Black & white base with color as reward on hover
4. **Border emphasis**: Thick colored borders frame content like posters/flyers
5. **Chaotic grid**: Varied column spans (4-8 cols) break monotony

### Design System Version
1. **Hero + grid pattern**: Establishes hierarchy (featured image vs supporting)
2. **16:9 hero ratio**: Cinematic presentation for main image
3. **3-column grid**: Optimal for scanning (not too many, not too few)
4. **Consistent hover states**: Matches existing site interaction patterns
5. **Professional dividers**: Uses existing `.professional-divider` for continuity

## Performance Considerations

- Proper `sizes` attribute prevents over-fetching images
- Lazy loading for all images except first hero (LCP optimization)
- No heavy animations or transitions that cause layout shift
- Optimized image delivery through Sanity CDN

## Accessibility

All versions include:
- Semantic HTML structure (`<article>`, `<section>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Keyboard-navigable jump links
- Sufficient color contrast (WCAG AA)
- No animations that could trigger motion sensitivity (per existing site patterns)

## Next Steps

### For Production Implementation

1. **Choose a version** based on brand direction and client feedback
2. **Update** `/projects/page.tsx` with chosen design
3. **Remove** `/projects-preview` directory
4. **Test** across devices and browsers
5. **Optimize** images in Sanity CMS (proper dimensions, compression)
6. **Add** loading states for better UX
7. **Implement** pagination or infinite scroll for large portfolios

### Potential Enhancements

- **Filtering**: Add category/client filters
- **Search**: Allow text search across projects
- **Sorting**: Let users sort by date, title, client
- **Sharing**: Add social sharing for individual projects
- **Print styles**: Optimize for PDF generation
- **Analytics**: Track which projects get most views

## File Structure

```
src/app/projects-preview/
├── page.tsx                    # Main preview page (server component)
├── MinimalVersion.tsx          # Client component - minimal design
├── PunkRockVersion.tsx         # Client component - punk rock design
├── DesignSystemVersion.tsx     # Client component - design system aligned
└── README.md                   # This file
```

## Related Files

- `/src/app/projects/page.tsx` - Current production projects page
- `/src/app/projects/ProjectsClient.tsx` - Current production client component
- `/src/app/globals.css` - Design system CSS classes
- `/sanity/lib/queries.ts` - CMS queries
- `/sanity/schemaTypes/project.ts` - Project schema

---

**Note**: This preview page is for internal review only. Consider setting `robots: 'noindex, nofollow'` in metadata to prevent search engine indexing.
