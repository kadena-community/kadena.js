import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import readdir from 'tiny-readdir-glob';

const srcDir = join(process.cwd(), 'src');
const distDir = join(process.cwd(), 'dist');
const distExtensions = ['.mjs', '.cjs'];
async function hasClientDirective(path: string) {
  const content = await readFile(path, 'utf-8');
  return content.includes(`'use client'`);
}

async function addClientDirective(path: string) {
  const content = await readFile(path, 'utf-8');
  const newContent = `"use client"\n${content}`;
  await writeFile(path, newContent);
}

async function main() {
  const aborter = new AbortController();
  const result = await readdir(['src/**/*.tsx', 'src/**/*.ts'], {
    depth: 20,
    limit: 1_000_000,
    followSymlinks: true,
    ignore: ['src/**/*.spec.tsx', 'src/**/*.stories.tsx'],
    signal: aborter.signal,
  });

  for (const file of result.files) {
    if (await hasClientDirective(file)) {
      for (const ext of distExtensions) {
        const distPath = file.replace(srcDir, distDir).replace('.tsx', ext);
        if (existsSync(distPath)) {
          console.log(`Adding 'use client' for ${distPath}\n`);
          await addClientDirective(distPath);
        }
      }
    }
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
