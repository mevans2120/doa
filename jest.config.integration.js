const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

// Integration test config - no mocking of Sanity
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.integration.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(next-sanity|@sanity|@faker-js|groq)/)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // NO mocking of Sanity for integration tests
  },
  // Longer timeout for API calls
  testTimeout: 10000,
}

module.exports = createJestConfig(customJestConfig)