#!/usr/bin/env node
import { build } from 'esbuild';
import { aliasPath } from 'esbuild-plugin-alias-path';

(async () => {
  const res = await build({
    entryPoints: ['./dist/index.d.ts'],
    bundle: true,
    outfile: './dist/index-build.js',
    platform: 'node',
    format: 'cjs',
    plugins: [
      aliasPath({
        alias: {
          '@db': './src/db',
          '@services': './src/services',
          '@utils': './src/utils',
          '@devnet': './src/devnet',
        },
      }),
    ],
  });
})().catch(console.error);
