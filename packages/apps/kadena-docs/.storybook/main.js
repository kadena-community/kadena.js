const path = require('path');

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    'storybook-dark-mode',
    'storybook-addon-next-router',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,

      '@/components': path.resolve(__dirname, '../src/components'),
      '@/utils': path.resolve(__dirname, '../src/utils'),
      '@/types': path.resolve(__dirname, '../src/types'),
      '@/markdoc': path.resolve(__dirname, '../src/markdoc'),
    };

    return config;
  },
};
