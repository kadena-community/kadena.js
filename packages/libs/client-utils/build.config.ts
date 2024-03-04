import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: `./src`,
      outDir: `./lib/esm`,
      cleanDist: true,
      format: 'esm',
    },
    {
      builder: 'mkdist',
      input: `./src`,
      outDir: `./lib/cjs`,
      cleanDist: true,
      format: 'cjs',
    },
  ],
  outDir: 'lib',
  clean: true,
  declaration: true,
});
