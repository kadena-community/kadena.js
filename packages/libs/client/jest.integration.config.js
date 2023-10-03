module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testTimeout: 60000,
  testEnvironment: 'node',
  globals: {
    __NETWORK_ID__: 'fast-development',
  },
  rootDir: './',
  testMatch: [
    '<rootDir>/src/integration-tests/*.int.{spec,test}.{ts,tsx}',
  ],
};
