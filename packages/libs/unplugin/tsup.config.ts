import type { Options } from 'tsup';
import { dependencies, devDependencies } from './package.json';

export default <Options>{
  entryPoints: ['src/*.ts'],
  clean: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
  splitting: false,
  bundle: true,
  minify: false,
  sourcemap: true,
  dts: true,
  target: 'es2022',
  platform: 'node',
  external: Object.keys(dependencies).concat(Object.keys(devDependencies)),
  onSuccess: 'pnpm build:fix',
};
