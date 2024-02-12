import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src/',
      outDir: './dist/esm',
      cleanDist: true,
      format: 'esm',
    },
    {
      builder: 'mkdist',
      input: './src/',
      outDir: './dist/cjs',
      cleanDist: true,
      format: 'cjs',
    },
  ],

  // Change outDir, default is 'dist'
  outDir: 'dist',
  clean: true,
  // Generates .d.ts declaration file
  declaration: true,
});
