/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  extends: '@kadena/heft-rig/profiles/default/config/jest.config.json',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
