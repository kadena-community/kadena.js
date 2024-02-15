import { readdirSync } from 'fs';
import { BuildEntry, defineBuildConfig } from 'unbuild';
import { updatePackageJson } from './scripts/updatePackageJson';
const iconsGroups = readdirSync('./src');
const entries: BuildEntry[] = iconsGroups.flatMap((group) => [
  {
    builder: 'mkdist',
    input: `./src/${group}`,
    outDir: `./dist/${group}/esm`,
    cleanDist: true,
    format: 'esm',
  },
  {
    builder: 'mkdist',
    input: `./src/${group}`,
    outDir: `./dist/${group}/cjs`,
    cleanDist: true,
    format: 'cjs',
  },
]);

export default defineBuildConfig({
  entries,
  // Change outDir, default is 'dist'
  outDir: 'dist',
  clean: true,
  // Generates .d.ts declaration file
  declaration: true,
  hooks: {
    'build:done': async () => updatePackageJson(iconsGroups, 'system'),
  },
});
