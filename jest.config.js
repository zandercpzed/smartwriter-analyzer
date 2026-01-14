/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^obsidian$': '<rootDir>/src/__mocks__/obsidian.ts',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
};
