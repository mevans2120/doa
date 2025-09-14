/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Mock Sanity image URL builder
export const urlFor = jest.fn((_source: any) => ({
  width: jest.fn().mockReturnThis(),
  height: jest.fn().mockReturnThis(),
  auto: jest.fn().mockReturnThis(),
  format: jest.fn().mockReturnThis(),
  url: jest.fn(() => '/mock-image-url.jpg'),
}))