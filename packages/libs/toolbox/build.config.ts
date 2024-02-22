import { readdirSync } from 'fs';
import { BuildEntry, defineBuildConfig } from 'unbuild';

const entries: BuildEntry[] = readdirSync('./src').flatMap((entry) => {
  return [
    {
      builder: 'mkdist',
      input: `./src/${entry}`,
      outDir: `./dist/${entry}/esm`,
      cleanDist: true,
      format: 'esm',
    },
    {
      builder: 'mkdist',
      input: `./src/${entry}`,
      outDir: `./dist/${entry}/cjs`,
      cleanDist: true,
      format: 'cjs',
    },
  ];
});

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: `./src`,
      outDir: `./dist/esm`,
      cleanDist: true,
      format: 'esm',
    },
    {
      builder: 'mkdist',
      input: `./src`,
      outDir: `./dist/cjs`,
      cleanDist: true,
      format: 'cjs',
    },
  ],
  outDir: 'dist',
  clean: true,
  declaration: true,
});
