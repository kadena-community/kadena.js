import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import polyfill from 'rollup-plugin-polyfill-node';
import preserveUseClientDirective from 'rollup-plugin-preserve-use-client';
import pkg from './package.json' with { type: 'json' };

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
console.log('External dependencies:', external);

const input = [
  './src/index.ts',
  './src/entries/global.ts',
  './src/entries/patterns.ts',
  './src/entries/styles.ts',
];

const moduleSideEffectsList = 'no-external';
// const moduleSideEffects = (id, external) => {
//   if (external) return false;
//   return (
//     id.endsWith('.css') || id.endsWith('.css.ts') || id.endsWith('global.ts')
//   );
// };

const plugins = [
  resolve({
    // resolveOnly: (mod, ...args) => {
    //   console.log('resolveonly', mod, args);
    //   return mod !== '@kadena/kode-icons';
    // },
  }),
  commonjs(),
  polyfill(),
  preserveUseClientDirective(),
  esbuild({
    include: /\.[jt]sx?$/,
    target: 'es2020',
    tsconfig: 'tsconfig.json',
    sourceMap: true,
  }),
];

const baseOutputEs = {
  format: 'es',
  dir: './dist',
  entryFileNames: '[name].mjs',
  chunkFileNames: '[name]-[hash].mjs',
  preserveModules: true,
  preserveModulesRoot: 'src',
};
const baseOutputCjs = {
  ...baseOutputEs,
  format: 'cjs',
  entryFileNames: '[name].cjs',
  chunkFileNames: '[name]-[hash].cjs',
};

const treeshake = { moduleSideEffects: moduleSideEffectsList };

export default [
  {
    input: input.at(0),
    external,
    output: [baseOutputEs, baseOutputCjs],
    plugins: [del({ targets: './dist' }), ...plugins],
    treeshake,
  },
  {
    input: input.slice(1),
    external,
    output: [
      {
        ...baseOutputEs,
        preserveModulesRoot: 'src/entries',
      },
      {
        ...baseOutputCjs,
        preserveModulesRoot: 'src/entries',
      },
    ],
    plugins,
    treeshake,
  },
  ...input.map((file) => ({
    input: file,
    external,
    output: { dir: './dist', format: 'es', entryFileNames: '[name].d.ts' },
    plugins: [dts()],
  })),
];
