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
      dependencies: [
        '@kadena-dev/*',
        '@kadena/types',
        '@kadena/kode-icons',
        '@kadena/docs-tools',
      ],
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
    {
      label:
        'Allow `@kadena/tools` to downgrade `@vanilla-extract/next-plugin` to fix initial render issues (see https://github.com/vanilla-extract-css/vanilla-extract/issues/1152#issuecomment-1784531987)',
      packages: ['@kadena/tools'],
      dependencies: ['@vanilla-extract/next-plugin'],
    },
  ],
};

module.exports = config;
