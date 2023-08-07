/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testTimeout: 60000,
  testEnvironment: 'node',
  globals: {
    __NETWORK_ID__: 'fast-development',
  },
  rootDir: '../',
  testMatch: [
    '<rootDir>/src/integration-tests/*.int.{spec,test}.{js,jsx,ts,tsx}',
  ],
};
