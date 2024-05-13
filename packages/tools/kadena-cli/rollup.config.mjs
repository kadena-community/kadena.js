import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: './lib',
    intro: 'const navigator = {};',
    format: 'es',
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
