import { readdirSync } from 'fs';
import { BuildEntry, defineBuildConfig } from 'unbuild';
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
  outDir: 'dist',
  clean: true,
  declaration: true,
});
