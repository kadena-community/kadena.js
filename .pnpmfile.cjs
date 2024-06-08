const ALLOWED_ROOT_DEPENDENCIES = [
  '@changesets/cli',
  '@kadena-dev/markdown',
  'knip',
  'only-allow',
  'prettier',
  'prettier-plugin-organize-imports',
  'prettier-plugin-packagejson',
  'syncpack',
  'tsx',
  'turbo',
  'vercel',
  'turbo-ignore'
];

function readPackage(pkg, context) {
  if (pkg.name === '@kadena/js-monorepo') {
    const deps = Object.keys({
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    });
    deps.forEach((pkg) => {
      if (!ALLOWED_ROOT_DEPENDENCIES.includes(pkg)) {
        throw new Error(`Root dependency not allowed: ${pkg}`);
      }
    });
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
