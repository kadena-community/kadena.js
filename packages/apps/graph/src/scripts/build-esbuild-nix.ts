#!/usr/bin/env node
import { build } from 'esbuild';
import { aliasPath } from 'esbuild-plugin-alias-path';

(async () => {
  const res = await build({
    entryPoints: ['./dist/index.d.ts'],
    bundle: true,
    outfile: './dist/index-build-nix.js',
    platform: 'node',
    format: 'cjs',
    plugins: [
      aliasPath({
        alias: {
          '@db': './dist/db',
          '@services': './dist/services',
          '@utils': './dist/utils',
          '@devnet': './dist/devnet',
        },
      }),
    ],
  });
})().catch(console.error);
