/**
 * Unit tests for Sanity image helper functions
 *
 * Tests aspect ratio calculations, URL generation, and helper functions.
 */

// Mock the Sanity client before importing the image module
jest.mock('../client', () => ({
  client: {
    config: jest.fn(() => ({
      projectId: 'test-project',
      dataset: 'test',
    })),
  },
}))

import {
  urlFor,
  urlForWithOptions,
  landscapeImage,
  portraitImage,
  squareImage,
  type AspectRatio,
  type ImageUrlOptions,
} from '../image'

describe('Image URL Helpers', () => {
  // Mock image object matching Sanity structure
  // Use valid Sanity asset ID format: image-{hash}-{width}x{height}-{format}
  const mockImage = {
    _type: 'responsiveImage' as const,
    asset: {
      _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
      _type: 'sanity.imageAsset' as const,
      url: 'https://cdn.sanity.io/images/test-project/test/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg',
    },
    alt: 'Test image',
  }

  describe('urlFor (backward compatibility)', () => {
    it('returns image builder', () => {
      const builder = urlFor(mockImage)
      expect(builder).toBeDefined()
      expect(typeof builder.url).toBe('function')
    })

    it('generates valid URL', () => {
      const url = urlFor(mockImage).url()
      expect(url).toBeDefined()
      expect(typeof url).toBe('string')
    })

    it('supports chaining width', () => {
      const url = urlFor(mockImage).width(800).url()
      expect(url).toContain('w=800')
    })

    it('supports chaining height', () => {
      const url = urlFor(mockImage).height(600).url()
      expect(url).toContain('h=600')
    })
  })

  describe('urlForWithOptions', () => {
    it('returns image builder', () => {
      const builder = urlForWithOptions(mockImage)
      expect(builder).toBeDefined()
      expect(typeof builder.url).toBe('function')
    })

    it('applies width parameter', () => {
      const url = urlForWithOptions(mockImage, { width: 800 }).url()
      expect(url).toContain('w=800')
    })

    it('applies height parameter', () => {
      const url = urlForWithOptions(mockImage, { height: 600 }).url()
      expect(url).toContain('h=600')
    })

    it('applies aspect ratio for landscape (16:9)', () => {
      const url = urlForWithOptions(mockImage, {
        width: 1600,
        aspectRatio: '16:9',
      }).url()
      expect(url).toContain('w=1600')
      expect(url).toContain('h=900')
    })

    it('applies aspect ratio for portrait (4:5)', () => {
      const url = urlForWithOptions(mockImage, {
        width: 800,
        aspectRatio: '4:5',
      }).url()
      expect(url).toContain('w=800')
      expect(url).toContain('h=1000')
    })

    it('applies aspect ratio for square (1:1)', () => {
      const url = urlForWithOptions(mockImage, {
        width: 400,
        aspectRatio: '1:1',
      }).url()
      expect(url).toContain('w=400')
      expect(url).toContain('h=400')
    })

    it('uses focalpoint crop when aspect ratio specified', () => {
      const url = urlForWithOptions(mockImage, {
        width: 800,
        aspectRatio: '4:5',
      }).url()
      expect(url).toContain('fit=crop')
      expect(url).toContain('crop=focalpoint')
    })

    it('does not crop when aspectRatio is "original"', () => {
      const url = urlForWithOptions(mockImage, {
        width: 800,
        aspectRatio: 'original',
      }).url()
      expect(url).toContain('w=800')
      expect(url).not.toContain('fit=crop')
    })

    it('applies quality parameter', () => {
      const url = urlForWithOptions(mockImage, {
        width: 800,
        quality: 90,
      }).url()
      expect(url).toContain('q=90')
    })

    it('applies auto format parameter', () => {
      const url = urlForWithOptions(mockImage, {
        width: 800,
        auto: 'format',
      }).url()
      expect(url).toContain('auto=format')
    })

    it('combines multiple options', () => {
      const url = urlForWithOptions(mockImage, {
        width: 1200,
        aspectRatio: '16:9',
        quality: 85,
        auto: 'format',
      }).url()
      expect(url).toContain('w=1200')
      expect(url).toContain('h=675')
      expect(url).toContain('q=85')
      expect(url).toContain('auto=format')
      expect(url).toContain('fit=crop')
      expect(url).toContain('crop=focalpoint')
    })
  })

  describe('convenience functions', () => {
    describe('landscapeImage', () => {
      it('creates 16:9 images with default width', () => {
        const url = landscapeImage(mockImage).url()
        expect(url).toContain('w=1200')
        expect(url).toContain('h=675')
      })

      it('creates 16:9 images with custom width', () => {
        const url = landscapeImage(mockImage, 1600).url()
        expect(url).toContain('w=1600')
        expect(url).toContain('h=900')
      })

      it('applies quality and auto-format', () => {
        const url = landscapeImage(mockImage).url()
        expect(url).toContain('q=85')
        expect(url).toContain('auto=format')
      })

      it('uses focalpoint cropping', () => {
        const url = landscapeImage(mockImage).url()
        expect(url).toContain('fit=crop')
        expect(url).toContain('crop=focalpoint')
      })
    })

    describe('portraitImage', () => {
      it('creates 4:5 images with default width', () => {
        const url = portraitImage(mockImage).url()
        expect(url).toContain('w=600')
        expect(url).toContain('h=750')
      })

      it('creates 4:5 images with custom width', () => {
        const url = portraitImage(mockImage, 800).url()
        expect(url).toContain('w=800')
        expect(url).toContain('h=1000')
      })

      it('applies quality and auto-format', () => {
        const url = portraitImage(mockImage).url()
        expect(url).toContain('q=85')
        expect(url).toContain('auto=format')
      })

      it('uses focalpoint cropping', () => {
        const url = portraitImage(mockImage).url()
        expect(url).toContain('fit=crop')
        expect(url).toContain('crop=focalpoint')
      })
    })

    describe('squareImage', () => {
      it('creates 1:1 images with default width', () => {
        const url = squareImage(mockImage).url()
        expect(url).toContain('w=400')
        expect(url).toContain('h=400')
      })

      it('creates 1:1 images with custom width', () => {
        const url = squareImage(mockImage, 600).url()
        expect(url).toContain('w=600')
        expect(url).toContain('h=600')
      })

      it('applies quality and auto-format', () => {
        const url = squareImage(mockImage).url()
        expect(url).toContain('q=85')
        expect(url).toContain('auto=format')
      })

      it('uses focalpoint cropping', () => {
        const url = squareImage(mockImage).url()
        expect(url).toContain('fit=crop')
        expect(url).toContain('crop=focalpoint')
      })
    })
  })

  describe('TypeScript types', () => {
    it('AspectRatio type includes all expected values', () => {
      const ratios: AspectRatio[] = ['16:9', '4:5', '1:1', 'original']
      expect(ratios).toHaveLength(4)
    })

    it('ImageUrlOptions allows all properties', () => {
      const options: ImageUrlOptions = {
        width: 800,
        height: 600,
        aspectRatio: '16:9',
        quality: 90,
        auto: 'format',
      }
      expect(options).toBeDefined()
    })

    it('ImageUrlOptions allows partial properties', () => {
      const options: ImageUrlOptions = {
        width: 800,
      }
      expect(options).toBeDefined()
    })

    it('ImageUrlOptions allows empty object', () => {
      const options: ImageUrlOptions = {}
      expect(options).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('handles missing asset by throwing error', () => {
      const invalidImage = {
        _type: 'responsiveImage' as const,
        alt: 'Test',
      }
      // Sanity image builder will throw if asset is missing
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        urlFor(invalidImage as any).url()
      }).toThrow()
    })

    it('calculates height from aspect ratio when width provided', () => {
      const url = urlForWithOptions(mockImage, {
        width: 1920,
        aspectRatio: '16:9',
      }).url()
      expect(url).toContain('w=1920')
      expect(url).toContain('h=1080')
    })

    it('calculates width from aspect ratio when height provided', () => {
      const url = urlForWithOptions(mockImage, {
        height: 1080,
        aspectRatio: '16:9',
      }).url()
      expect(url).toContain('h=1080')
      expect(url).toContain('w=1920')
    })

    it('rounds dimensions to nearest integer', () => {
      // 16:9 with 1000px width = 562.5px height
      const url = urlForWithOptions(mockImage, {
        width: 1000,
        aspectRatio: '16:9',
      }).url()
      expect(url).toContain('w=1000')
      // Should be rounded to 562 or 563
      expect(url).toMatch(/h=56[23]/)
    })
  })
})
