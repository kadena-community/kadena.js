const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  reporters: ['jest-standard-reporter'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async (...args) => {
  const fn = createJestConfig(customJestConfig);
  const res = await fn(...args);

  res.transformIgnorePatterns = res.transformIgnorePatterns.map((pattern) => {
    if (pattern === '/node_modules/') {
      return '/node_modules(?!/yaml)/';
    }
    return pattern;
  });

  return res;
};
