#!/usr/bin/env ./node_modules/.bin/tsx
import path from 'path';
import { $, fs } from 'zx';

if (path.basename(process.cwd()) !== 'dev-wallet') {
  throw new Error('This script should be run from the dev-wallet directory');
}

const { dependencies } = await fs
  .readFile(path.join(process.cwd(), '/package.json'), 'utf-8')
  .then(JSON.parse);
const plugins = Object.keys(dependencies).filter((dep) =>
  dep.match(/@kadena\/chainweaver-.*-plugin/),
);

const directory = (plugin: string) => `public/internal-registry/${plugin}`;

const resolveModule = (plugin: string) =>
  path.resolve(process.cwd(), `./node_modules/${plugin}`);

await Promise.all(
  plugins.map(async (plugin) => {
    await $`mkdir -p ${directory(plugin)}`;
    // await $`cp -R ${path.join(resolveModule(plugin), 'dist')} ${path.resolve(process.cwd(), 'public/internal-registry', plugin, 'dist')}`;
    await $`ln -s ${path.join(resolveModule(plugin), 'dist')} ${path.join(process.cwd(), 'public/internal-registry', plugin, 'dist')}`;
  }),
);

console.log(
  `Symlinks created for the following plugins:\n${plugins.map((x) => `- ${x}`).join(', ')}`,
);
