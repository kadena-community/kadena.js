/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testTimeout: 10000,
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: [
    '<rootDir>/src/integration-tests/*.int.{spec,test}.{js,jsx,ts,tsx}',
  ],
};
