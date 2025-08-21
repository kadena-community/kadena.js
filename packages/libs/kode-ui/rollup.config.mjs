import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

export default [
  // Main bundle (CJS and ESM)
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/cjs/index.js', format: 'cjs', sourcemap: true },
      { file: 'dist/esm/index.js', format: 'esm', sourcemap: true },
    ],
    plugins: [
      peerDepsExternal(), // Exclude peer dependencies (e.g., React)
      resolve(), // Resolve node_modules dependencies
      commonjs(), // Convert CommonJS to ES modules
      typescript({ tsconfig: './tsconfig.json' }), // Transpile TypeScript
      postcss(), // Required for Vanilla Extract CSS processing
      vanillaExtractPlugin(), // Process Vanilla Extract .css.ts files
    ],
    external: ['react', 'react-dom'], // Keep React external
  },
  // Type definitions
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/], // Exclude CSS from type bundle
  },
];
