#!/usr/bin/env ./node_modules/.bin/tsx
import path from 'path';
import { $, fs } from 'zx';

if (path.basename(process.cwd()) !== 'dev-wallet') {
  throw new Error('This script should be run from the dev-wallet directory');
}

console.log('Creating plugins.json');

export interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
interface IPluginPackageJson {
  'chainweaver-plugin-manifest'?: {
    name: string;
    description: string;
    permissions: Array<string>;
  };
  name: string;
  version: string;
  description: string;
}

const { dependencies } = await $`cat package.json`.json();
const plugins = Object.keys(dependencies).filter((dep) =>
  dep.match(/@kadena\/chainweaver-.*-plugin/),
);

const pluginsJson = await Promise.all(
  plugins.map(async (plugin) => {
    console.log('Processing plugin', plugin, 'loading package.json');
    console.log(`cat ./node_modules/${plugin}/package.json`);

    // get plugin package.json
    const packageJson =
      await $`cat ./node_modules/${plugin}/package.json`.json<IPluginPackageJson>();

    if (!packageJson['chainweaver-plugin-manifest']) {
      // if plugin does not have a manifest, use defaults
      console.warn(`Plugin ${plugin} does not have a manifest`);
      console.log(`Continuing using defaults without permissions`);
      return {
        id: plugin,
        name: plugin,
        registry: '/internal-registry',
        description: packageJson.description || plugin,
        version: packageJson.version,
        permissions: [],
      };
    }

    const manifest = packageJson['chainweaver-plugin-manifest'];
    // use the values from manifest as overrides for defaults in package.json
    return {
      id: plugin,
      name: manifest.name || packageJson.name,
      registry: '/internal-registry',
      description: manifest.description || packageJson.description || plugin,
      version: packageJson.version,
      permissions: manifest.permissions || [],
    };
  }),
);

const pluginsJsonString = JSON.stringify(pluginsJson, null, 2);

console.log(`Writing file to ./public/internal-registry/plugins.json`);
fs.writeFileSync(
  path.join(process.cwd(), './public/internal-registry/plugins.json'),
  pluginsJsonString,
);
console.log(`Finished writing plugins.json`);
