const sharedConfig = require('@kadena-dev/heft-rig/jest.config.json');

module.exports = {
  ...sharedConfig,
  coverageThreshold: {
    global: {
      branches: 87,
    },
  },
};
