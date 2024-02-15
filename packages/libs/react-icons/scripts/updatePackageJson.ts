import { writeFile } from 'node:fs/promises';
import packageJson from '../package.json';
import { formatCode, getPrettierConfigs } from './utils';

export async function updatePackageJson(
  groups: string[],
  defaultGroup: string,
) {
  const exports = {} as Record<string, any>;
  groups.reduce((acc, group) => {
    acc[`./${group}`] = {
      types: {
        import: `./dist/${group}/esm/index.d.ts`,
        require: `./dist/${group}/cjs/index.d.ts`,
      },
      import: `./dist/${group}/esm/index.mjs`,
      require: `./dist/${group}/cjs/index.js`,
    };
    return acc;
  }, exports);
  const defaultGroupExports = exports[`./${defaultGroup}`];
  exports['.'] = defaultGroupExports;
  // @ts-ignore
  packageJson.main = defaultGroupExports.require;
  // @ts-ignore
  packageJson.module = defaultGroupExports.import;
  // @ts-ignore
  packageJson.types = defaultGroupExports.types.require;
  // @ts-ignore
  packageJson.exports = exports;
  const prettierConfig = await getPrettierConfigs();
  prettierConfig.parser = 'json';
  await writeFile(
    'package.json',
    await formatCode(JSON.stringify(packageJson, null, 2), prettierConfig),
  );
}
