import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
  // external: [
  //   '@kadena/client',
  //   '@kadena/client-utils/coin',
  //   '@kadena/client-utils/core',
  //   'valibot',
  //   '@urql/core',
  // ],
  plugins: [
    typescript({ declaration: true }),
    commonjs(),
    json(),
    resolve(),
    nodePolyfills(),
    inject({ global: 'globalThis' }),
  ],
};
