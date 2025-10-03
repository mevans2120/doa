/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Mock Sanity image URL builder
 *
 * Provides test doubles for all image helper functions.
 * Returns consistent mock URLs for testing purposes.
 */

import type { AspectRatio, ImageUrlOptions } from '../../../../sanity/lib/image'

/**
 * Create a mock builder instance with chainable methods
 */
const createMockBuilder = () => ({
  width: jest.fn().mockReturnThis(),
  height: jest.fn().mockReturnThis(),
  auto: jest.fn().mockReturnThis(),
  format: jest.fn().mockReturnThis(),
  quality: jest.fn().mockReturnThis(),
  fit: jest.fn().mockReturnThis(),
  crop: jest.fn().mockReturnThis(),
  url: jest.fn(() => 'https://example.com/mocked-image.jpg'),
})

/**
 * Mock basic urlFor function
 */
export const urlFor = jest.fn((_source: any) => createMockBuilder())

/**
 * Mock urlForWithOptions function
 */
export const urlForWithOptions = jest.fn(
  (_source: any, _options?: ImageUrlOptions) => createMockBuilder()
)

/**
 * Mock landscapeImage function
 */
export const landscapeImage = jest.fn((_source: any, _width?: number) =>
  createMockBuilder()
)

/**
 * Mock portraitImage function
 */
export const portraitImage = jest.fn((_source: any, _width?: number) =>
  createMockBuilder()
)

/**
 * Mock squareImage function
 */
export const squareImage = jest.fn((_source: any, _width?: number) =>
  createMockBuilder()
)

/**
 * Export type for tests
 */
export type { AspectRatio, ImageUrlOptions }
