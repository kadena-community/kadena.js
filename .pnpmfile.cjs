const ALLOWED_DEPENDENCIES = {
  '@kadena/js-monorepo': [
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
  ],
};

/**
 * @type {Record<string, Record<string,string>>}
 *
 * @example {
 *  '@rushstack/eslint-config': { // package to modify a dependency for
 *   '@typescript-eslint/eslint-plugin': '~6.19.0', // desired version
 *  }
 * }
 */
const RESOLUTIONS = {
  '@rushstack/eslint-config': {
    '@typescript-eslint/eslint-plugin': '6.21.0',
    '@typescript-eslint/utils': '6.21.0',
    '@typescript-eslint/parser': '6.21.0',
    '@typescript-eslint/typescript-estree': '6.21.0',
  },
};

function readPackage(pkg, context) {
  // if it's in one of the two constants
  if (
    Object.keys({ ...RESOLUTIONS, ...ALLOWED_DEPENDENCIES }).includes(pkg.name)
  ) {
    // if it's part of the packages to check for allowed dependencies
    if (Object.keys(ALLOWED_DEPENDENCIES).includes(pkg.name)) {
      context.log(`Checking allowed dependencies for ${pkg.name}`);
      const allDependencies = Object.keys({
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
      });
      allDependencies.forEach((dep) => {
        if (!ALLOWED_DEPENDENCIES[pkg.name].includes(dep)) {
          context.log(`Root dependency not allowed: ${dep}`);
          throw new Error(`Root dependency not allowed: ${dep}`);
        }
      });
    }

    // if it's part of the packages to MODIFY for resolutions
    if (Object.keys(RESOLUTIONS).includes(pkg.name)) {
      context.log(`Setting resolutions for ${pkg.name}`);
      const resolutions = RESOLUTIONS[pkg.name];

      // if the package doesn't have any dependencies to modify
      if (
        !hasCommonElement(
          Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }),
          Object.keys(resolutions),
        )
      ) {
        throw new Error(`No dependencies to modify for ${pkg.name}`);
      }

      // when the package has dependencies to modify
      Object.entries(resolutions).forEach(([dep, version]) => {
        // it could be either dependencies or devDependencies
        if (pkg.dependencies?.[dep]) {
          context.log(
            `  - ${dep}@${pkg.dependencies[dep]} => ${dep}@${version}`,
          );
          pkg.dependencies[dep] = version;
        } // package will never be in both dependencies and devDependencies
        else if (pkg.devDependencies?.[dep]) {
          context.log(
            `  - ${dep}@${pkg.devDependencies[dep]} => ${dep}@${version}`,
          );
          pkg.devDependencies[dep] = version;
        }
      });
    }
  }
  return pkg;
}

function hasCommonElement(arr1, arr2) {
  return arr1.some((element) => arr2.includes(element));
}

module.exports = {
  hooks: {
    readPackage,
  },
};
