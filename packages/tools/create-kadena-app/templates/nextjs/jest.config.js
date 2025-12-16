const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: '<rootDir>/jest-environment-jsdom-no-canvas.js',
  reporters: ['jest-standard-reporter'],
  moduleNameMapper: {
    '^canvas$': '<rootDir>/__mocks__/canvas.js',
  },
};

module.exports = async (...args) => {
  const fn = createJestConfig(customJestConfig);
  const res = await fn(...args);

  // Add transform ignore patterns to prevent canvas from being processed
  res.transformIgnorePatterns = [
    'node_modules/(?!(yaml|@walletconnect))',
  ];

  // Override moduleNameMapper to include canvas mock
  res.moduleNameMapper = {
    ...res.moduleNameMapper,
    '^canvas$': '<rootDir>/__mocks__/canvas.js',
  };

  return res;
};
