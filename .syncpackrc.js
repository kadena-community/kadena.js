// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      label: 'Internal packages that have inconsistent version usage',
      packages: ['**'],
      dependencies: [
        '@kadena/chainweb-node-client',
        '@kadena/client',
        '@kadena/fonts',
        '@kadena/pactjs-cli',
        '@kadena-dev/eslint-plugin',
        'remark-gfm',
      ],
      isIgnored: true, // Toggle flag or or remove group to see inconsistencies
    },
    {
      label: 'Internal dev packages are pinned to `workspace:*`',
      packages: ['**'],
      dependencies: ['@kadena-dev/*', '@kadena/types'],
      dependencyTypes: ['dev'],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Internal production packages are pinned to `workspace:*`',
      packages: ['**'],
      dependencies: ['kadena.js', '@kadena/*'],
      dependencyTypes: ['prod'],
      pinVersion: 'workspace:*',
    },
    {
      label:
        'Types and internal dev packages are banned from dependencies (only allowed in devDependencies)',
      packages: ['**'],
      dependencies: ['@types/*', '*/types', '@kadena-dev/*'],
      dependencyTypes: ['prod'],
      isBanned: true,
    },
  ],
};

module.exports = config;
