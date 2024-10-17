import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [typescript({ declaration: true }), commonjs(), json(), resolve()],
};
