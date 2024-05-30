import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    dir: './lib',
    format: 'es',
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      declaration: false,
      declarationMap: false,
    }),
    json(),
  ],
};
