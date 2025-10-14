# Project Modal Consolidation - Implementation Plan

## Executive Summary

This refactoring consolidates two nearly identical project modal implementations into a single, DRY (Don't Repeat Yourself) solution. The plan extracts shared modal logic into reusable components while maintaining different data fetching strategies for homepage (featured projects) and projects page (all projects).

## Current State Analysis

### Component Comparison

| Feature | Projects.tsx (Homepage) | ProjectsClient.tsx (/projects) |
|---------|------------------------|-------------------------------|
| **Data Source** | useEffect + featuredProjectsQuery | Props (server-fetched) |
| **Description Type** | `TypedObject` (Portable Text) | `string` |
| **Description Renderer** | `<RichText>` component | Plain `<p>` tag |
| **Modal Image** | `getImageUrl()` with width/height | `getImageSource()` (respects crop) |
| **Image Container** | `aspect-[16/9]` with `object-cover` | `aspect-video` with `object-contain` + black bg |
| **Modal Size** | `w-[95vw] h-[95vh]` | `w-[95vw] h-[95vh]` |
| **Section Wrapper** | `<section>` with bg/padding | `<div>` with padding only |

### Key Differences to Reconcile

1. **Type Definitions**: Homepage uses `TypedObject` for description (Portable Text), /projects uses `string`
2. **Image Handling**: Homepage uses deprecated `getImageUrl()`, /projects uses modern `getImageSource()`
3. **Modal Rendering**: ProjectsClient has better image handling (object-contain, aspect-video, black bg)

## Dependency Analysis

### Task Dependencies Graph

```
1. Create shared types
   ↓
2. Extract ProjectModal component
   ↓
3. Create ProjectsGrid component
   ↓
4. Update Projects.tsx (Homepage)
   ↓
5. Update ProjectsClient.tsx (/projects)
   ↓
6. Test both implementations
   ↓
7. Remove deprecated code
```

## Implementation Plan

### Phase 1: Type Consolidation

#### Task 1.1: Update TypeScript Types
**File**: `src/types/sanity.ts`

**Changes**:
- Update `Project` interface to use `PortableTextBlock[]` for description (not optional)
- Ensure consistency with both query structures

**Acceptance Criteria**:
- Type definitions match both featuredProjectsQuery and projectsQuery
- No TypeScript errors in existing components

---

### Phase 2: Extract Shared Modal Component

#### Task 2.1: Create ProjectModal Component
**File**: `src/components/ProjectModal.tsx` (NEW)

**Structure**:
```tsx
'use client'

interface ProjectModalProps {
  project: ProjectData | null
  isOpen: boolean
  onClose: () => void
  currentImageIndex: number
  onNextImage: () => void
  onPrevImage: () => void
  onSelectImage: (index: number) => void
}
```

**Features**:
- Extract modal JSX from ProjectsClient (lines 139-239)
- Use `getImageSource()` for main images (respects crop data)
- Use `urlFor()` for thumbnails
- Use `<RichText>` for description rendering
- `aspect-video` + `object-contain` + black background for images
- Responsive grid (single column mobile, 2 columns desktop)

**Acceptance Criteria**:
- Modal displays correctly with all images
- Navigation buttons work (prev/next/thumbnails)
- Description renders as Portable Text
- Close button works
- Click outside modal closes it
- ESC key closes modal (bonus)

---

#### Task 2.2: Create ProjectsGrid Component
**File**: `src/components/ProjectsGrid.tsx` (NEW)

**Structure**:
```tsx
'use client'

interface ProjectsGridProps {
  projects: ProjectData[]
  onProjectClick: (project: ProjectData) => void
  showViewAllCTA?: boolean
}
```

**Features**:
- Extract grid JSX from Projects.tsx (lines 124-159)
- Use `urlFor()` for card thumbnails
- Hover effects (scale, brightness, border, shadow)
- Optional "View All Projects" CTA
- Empty state handling

**Acceptance Criteria**:
- Grid displays 3 columns on desktop, 1 on mobile
- Cards have proper hover effects
- Click handler fires correctly
- View All CTA shows only when `showViewAllCTA={true}`

---

### Phase 3: Create Shared Hook for Modal State

#### Task 3.1: Create useProjectModal Hook
**File**: `src/hooks/useProjectModal.ts` (NEW)

**Structure**:
```tsx
export const useProjectModal = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openModal = (project: ProjectData) => { ... }
  const closeModal = () => { ... }
  const nextImage = () => { ... }
  const prevImage = () => { ... }
  const selectImage = (index: number) => { ... }

  return {
    selectedProject,
    isModalOpen,
    currentImageIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
    selectImage
  }
}
```

**Acceptance Criteria**:
- Hook manages all modal state
- Navigation functions work correctly
- State resets on close

---

### Phase 4: Update Homepage Component

#### Task 4.1: Refactor Projects.tsx
**File**: `src/components/Projects.tsx`

**Changes**:
```tsx
'use client'

import { useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { featuredProjectsQuery } from '../../sanity/lib/queries'
import { useHomepage } from '@/contexts/HomepageContext'
import ProjectsGrid from './ProjectsGrid'
import ProjectModal from './ProjectModal'
import { useProjectModal } from '@/hooks/useProjectModal'
import type { ProjectData } from '@/types/sanity'

const Projects = () => {
  const { settings } = useHomepage()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const modal = useProjectModal()

  const sectionTitle = settings.sectionTitles?.featuredProjects || ''

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await client.fetch<ProjectData[]>(featuredProjectsQuery)
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <LoadingState title={sectionTitle} />
  }

  if (projects.length === 0) {
    return <EmptyState title={sectionTitle} />
  }

  return (
    <section className="py-20 bg-doa-black text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
            {sectionTitle}
          </h2>
        </div>

        <ProjectsGrid
          projects={projects}
          onProjectClick={modal.openModal}
          showViewAllCTA={true}
        />
      </div>

      <ProjectModal
        project={modal.selectedProject}
        isOpen={modal.isModalOpen}
        onClose={modal.closeModal}
        currentImageIndex={modal.currentImageIndex}
        onNextImage={modal.nextImage}
        onPrevImage={modal.prevImage}
        onSelectImage={modal.selectImage}
      />
    </section>
  )
}

export default Projects
```

**What Gets Removed**:
- Lines 78-85: `getImageUrl()` helper (use urlFor in grid component)
- Lines 124-160: Grid JSX (moved to ProjectsGrid)
- Lines 162-263: Modal JSX (moved to ProjectModal)
- Lines 50-76: Modal state and handlers (moved to useProjectModal hook)

**Acceptance Criteria**:
- Featured projects fetch and display correctly
- Modal opens/closes properly
- No regression in functionality
- Reduced from 268 lines to ~80 lines

---

### Phase 5: Update Projects Page Component

#### Task 5.1: Refactor ProjectsClient.tsx
**File**: `src/app/projects/ProjectsClient.tsx`

**Changes**:
```tsx
'use client'

import ProjectsGrid from '@/components/ProjectsGrid'
import ProjectModal from '@/components/ProjectModal'
import { useProjectModal } from '@/hooks/useProjectModal'
import type { ProjectData } from '@/types/sanity'

interface ProjectsClientProps {
  pageTitle: string
  pageDescription: string
  projects: ProjectData[]
}

const ProjectsClient = ({ pageTitle, pageDescription, projects }: ProjectsClientProps) => {
  const modal = useProjectModal()

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in-up">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            {pageDescription}
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects available.</p>
          </div>
        ) : (
          <ProjectsGrid
            projects={projects}
            onProjectClick={modal.openModal}
            showViewAllCTA={false}
          />
        )}
      </div>

      <ProjectModal
        project={modal.selectedProject}
        isOpen={modal.isModalOpen}
        onClose={modal.closeModal}
        currentImageIndex={modal.currentImageIndex}
        onNextImage={modal.nextImage}
        onPrevImage={modal.prevImage}
        onSelectImage={modal.selectImage}
      />
    </div>
  )
}

export default ProjectsClient
```

**What Gets Removed**:
- Lines 24-44: `getEffectiveAspectRatio()` (no longer needed)
- Lines 51-86: Modal state and helpers (moved to useProjectModal)
- Lines 106-135: Grid JSX (moved to ProjectsGrid)
- Lines 138-239: Modal JSX (moved to ProjectModal)

**Acceptance Criteria**:
- All projects display correctly
- Modal functionality unchanged
- No regression in behavior
- Reduced from 243 lines to ~60 lines

---

### Phase 6: Update Queries for Consistency

#### Task 6.1: Update featuredProjectsQuery
**File**: `sanity/lib/queries.ts`

**Changes**:
Add gallery field to featuredProjectsQuery to match projectsQuery:

```groq
export const featuredProjectsQuery = groq`*[_type == "project" && featured == true] | order(order asc) [0...6] {
  _id,
  title,
  client,
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  gallery[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    hotspot,
    crop,
    alt
  },
  description,
  year
}`
```

**Acceptance Criteria**:
- Homepage modals now show gallery images
- Query structure matches projectsQuery

---

### Phase 7: Testing & Cleanup

#### Task 7.1: Comprehensive Testing

**Test Cases**:
1. **Homepage Projects Section**
   - ✅ Featured projects load
   - ✅ Grid displays correctly
   - ✅ Modal opens on card click
   - ✅ Gallery navigation works
   - ✅ Thumbnail selection works
   - ✅ Close button works
   - ✅ Click outside closes modal
   - ✅ Description renders as rich text
   - ✅ "View All Projects" CTA appears

2. **/projects Page**
   - ✅ All projects load
   - ✅ Grid displays correctly
   - ✅ Modal opens on card click
   - ✅ Gallery navigation works
   - ✅ Thumbnail selection works
   - ✅ Close button works
   - ✅ Click outside closes modal
   - ✅ Description renders as rich text
   - ✅ No "View All" CTA

3. **Edge Cases**
   - ✅ Projects with no gallery (only mainImage)
   - ✅ Projects with no images
   - ✅ Empty projects array
   - ✅ Loading state (homepage only)
   - ✅ Mobile responsive behavior

**Acceptance Criteria**:
- All tests pass
- No console errors
- No TypeScript errors
- No visual regressions

---

#### Task 7.2: Remove Deprecated Code

**Actions**:
1. Search for `landscapeImage()` usage
2. Replace any remaining instances with `urlFor()` or `getImageSource()`
3. Consider deprecating `landscapeImage()` in `sanity/lib/image.ts`

**Acceptance Criteria**:
- No references to deprecated image helpers
- Build completes successfully

---

## File Structure Summary

### New Files (3)
```
src/
├── components/
│   ├── ProjectModal.tsx          (NEW - ~120 lines)
│   └── ProjectsGrid.tsx           (NEW - ~50 lines)
└── hooks/
    └── useProjectModal.ts         (NEW - ~45 lines)
```

### Modified Files (3)
```
├── src/
│   └── components/
│       └── Projects.tsx           (MODIFIED - 268 → ~80 lines)
├── src/app/projects/
│   └── ProjectsClient.tsx         (MODIFIED - 243 → ~60 lines)
└── sanity/lib/
    └── queries.ts                 (MODIFIED - add gallery to featuredProjectsQuery)
```

### Files to Review
```
sanity/lib/image.ts
- Consider deprecating landscapeImage()
```

---

## Risk Assessment & Mitigation

### High Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| Type mismatch between description formats | Build failure | Update types first, ensure Portable Text everywhere |
| Modal behavior differs subtly | User confusion | Comprehensive testing of both pages |

### Medium Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| Image rendering differences | Visual inconsistency | Use getImageSource() consistently for main images |
| Missing gallery in featured projects | Homepage modals broken | Update query to include gallery field |

### Low Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| Import path changes | Build errors | Update imports carefully, test build |
| CSS classes inconsistent | Minor styling issues | Copy exact classes from ProjectsClient |

---

## Recommended Execution Order

1. **Start**: Task 1.1 (Types) → Low risk, blocks nothing
2. **Core**: Task 3.1 (Hook) → Task 2.2 (Grid) → Task 2.1 (Modal)
3. **Integration**: Task 4.1 (Homepage) → Task 5.1 (/projects)
4. **Data**: Task 6.1 (Queries)
5. **Validation**: Task 7.1 (Testing) → Task 7.2 (Cleanup)

**Estimated Completion Time**: 3-4 hours

---

## Success Metrics

### Code Quality
- ✅ **DRY**: 500+ lines reduced to ~215 lines (57% reduction)
- ✅ **Maintainability**: Single source of truth for modal logic
- ✅ **Reusability**: Components can be used on future pages

### Functionality
- ✅ **Zero Regression**: Both pages work identically to before
- ✅ **Enhanced**: Homepage gets gallery support
- ✅ **Consistent**: Same modal behavior everywhere

### Developer Experience
- ✅ **Easier Updates**: Change modal once, affects both pages
- ✅ **Clear Separation**: Data fetching vs. presentation logic
- ✅ **Type Safety**: Consistent types prevent bugs

---

## Post-Implementation Checklist

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run build` - successful build
- [ ] Run `npm test` - all tests pass
- [ ] Test homepage projects section manually
- [ ] Test /projects page manually
- [ ] Test mobile responsive behavior
- [ ] Verify no console errors in browser
- [ ] Update memory bank with refactoring notes
- [ ] Consider adding unit tests for useProjectModal hook

---

## Notes

**Why Extract These Components?**
1. **ProjectModal**: 100+ lines of identical modal JSX
2. **ProjectsGrid**: 40+ lines of identical grid JSX
3. **useProjectModal**: 30+ lines of identical state management

**Why Keep Components Separate?**
- Different wrapper elements (`<section>` vs `<div>`)
- Different titles and descriptions
- Different data fetching strategies
- Clear separation of concerns

**Future Enhancements**:
- Add keyboard navigation (arrow keys for gallery)
- Add ESC key to close modal
- Add loading states to images
- Add error boundaries
- Consider adding animation to modal open/close
