const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  reporters: ['jest-standard-reporter'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
};
module.exports = createJestConfig(customJestConfig);
