import { defineBuildConfig } from 'unbuild';

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
