const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
  },
  collectCoverage: false,
  reporters: ['jest-standard-reporter'],
};
module.exports = createJestConfig(customJestConfig);
