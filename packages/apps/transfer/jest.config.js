const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.json"
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: false,
};
module.exports = createJestConfig(customJestConfig);
