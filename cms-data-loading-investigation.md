# CMS Data Loading Investigation Report

## Problem Summary

The AboutCTA component is displaying fallback text "Building Dreams, One Set at a Time" instead of the CMS-provided text "Ready to Create Something Extraordinary?" despite the CMS data being correctly fetched from Sanity.

## Root Cause Analysis

### Primary Issue: Race Condition in Client-Side Data Fetching

The root cause is a **client-side rendering race condition** where:

1. **Initial Render (Server & Client)**: The `HomepageProvider` initializes with an empty `settings` object (`{}`)
2. **Component Render**: `AboutCTA` immediately renders with fallback values because `settings.aboutCTA` is `undefined`
3. **Data Fetch**: After mount, `useEffect` in `HomepageProvider` fetches data from Sanity
4. **State Update**: The context updates with the fetched data
5. **Re-render Issue**: The component may not be re-rendering properly or the initial render is being cached

### Secondary Issues Identified

1. **No Loading State Handling**: The `AboutCTA` component doesn't check the `loading` state from the context, unlike test components
2. **Inconsistent Error Handling**: The error fallback in `HomepageProvider` only sets `sectionTitles.aboutCTA` (a string) but not the `aboutCTA` object structure
3. **SSR/Hydration Mismatch**: Since this is a client component with data fetched in `useEffect`, there's potential for hydration mismatches

## Data Flow Diagram

```
[Sanity CMS]
     |
     | GROQ Query: *[_type == "homepageSettings"][0]
     |
     v
[Sanity Client (client.ts)]
     |
     | fetch() in useEffect
     |
     v
[HomepageProvider Context]
     |
     | Initial: settings = {}
     | After fetch: settings = { aboutCTA: {...}, ... }
     |
     v
[AboutCTA Component]
     |
     | Uses: settings.aboutCTA?.heading
     | Falls back to: 'Building Dreams, One Set at a Time'
     |
     v
[Rendered Output]
```

## Specific Issues Found

### 1. Timing Issue
- **Location**: `src/contexts/HomepageContext.tsx`, line 46
- **Issue**: Initial state is empty object `{}`
- **Impact**: Components render with fallback values before data loads

### 2. Missing Loading Check
- **Location**: `src/components/AboutCTA.tsx`, line 6
- **Issue**: Component doesn't use `loading` state from context
- **Impact**: Component can't differentiate between "loading" and "no data"

### 3. Inconsistent Error Fallback
- **Location**: `src/contexts/HomepageContext.tsx`, lines 59-67
- **Issue**: Error case sets `sectionTitles.aboutCTA` as string, not `aboutCTA` object
- **Impact**: Inconsistent data structure in error scenarios

### 4. Data Structure Verification
- **Sanity Returns**: 
  ```json
  {
    "aboutCTA": {
      "heading": "Ready to Create Something Extraordinary?",
      "description": "...",
      "buttonText": "Discover Our Story",
      "buttonLink": "/about"
    }
  }
  ```
- **Component Expects**: Same structure ✓
- **Issue**: Data is correct but not available at initial render

## Recommended Fixes

### Fix 1: Add Loading State Check (Immediate)
```typescript
const AboutCTA = () => {
  const { settings, loading } = useHomepage()
  
  // Show skeleton or return null while loading
  if (loading) {
    return (
      <section className="py-16 px-10 bg-black relative noise-overlay paint-flecks">
        <div className="animate-pulse">
          {/* Skeleton UI */}
        </div>
      </section>
    )
  }
  
  const heading = settings.aboutCTA?.heading || 'Building Dreams, One Set at a Time'
  // ... rest of component
}
```

### Fix 2: Initialize Context with Proper Defaults (Better)
```typescript
// In HomepageContext.tsx
const [settings, setSettings] = useState<HomepageSettings>({
  aboutCTA: {
    heading: 'Building Dreams, One Set at a Time',
    description: 'With over 15 years of experience...',
    buttonText: 'Learn More About DOA',
    buttonLink: '/about'
  }
})
```

### Fix 3: Server-Side Data Fetching (Best - Long Term)
Convert to server component pattern or use Next.js data fetching methods to fetch data at build/request time rather than client-side.

### Fix 4: Fix Error Fallback Structure
```typescript
// In error catch block
setSettings({
  aboutCTA: {
    heading: 'Ready to Create Something Extraordinary?',
    description: 'With over 20 years of experience...',
    buttonText: 'Discover Our Story',
    buttonLink: '/about'
  },
  sectionTitles: {
    // ... existing section titles
  }
})
```

## Verification Steps

1. **Check Current Data Flow**:
   - ✓ Sanity returns correct data
   - ✓ Query structure is correct
   - ✗ Component doesn't wait for data

2. **Check Other Components**:
   - Hero.tsx - Same issue (no loading check)
   - Projects.tsx - Has its own loading state
   - Services.tsx - Has its own loading state
   - ClientLogos.tsx - Has its own loading state
   - Testimonials.tsx - Has its own loading state

## Conclusion

The issue is a classic React hydration/SSR problem where client-side data fetching causes the initial render to use fallback values. The recommended immediate fix is to add loading state handling. The long-term solution should involve server-side data fetching to ensure data is available at initial render.
