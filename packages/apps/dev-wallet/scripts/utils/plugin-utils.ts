export const logTap =
  (msg: string) =>
  <T>(x: T): T => {
    console.log(msg, x);
    return x;
  };

import fs, { readFileSync } from 'fs';
import path from 'path';

export interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export function readPackageJson<T>(packageName: string) {
  const packageJson = fs.readFileSync(
    path.resolve(__dirname, `./node_modules/${packageName}/package.json`),
    'utf-8',
  );
  return JSON.parse(packageJson) as T;
}

export function getChainweaverPluginsFromPackageJson(deps: PackageJson) {
  return Object.keys(deps.dependencies).filter((dep) =>
    dep.match(/@kadena\/chainweaver-.*-plugin/),
  );
}

export function generatePluginsJson() {
  const plugins = getChainweaverPluginsFromPackageJson(
    JSON.parse(
      readFileSync(path.resolve(__dirname, './package.json'), 'utf-8'),
    ) as PackageJson,
  );
  const pluginsJson = plugins.map((plugin) => {
    const packageJson = readPackageJson<{
      'chainweaver-plugin-manifest'?: {
        shortName: string;
        description: string;
        permissions: Array<string>;
      };
      version: string;
      description: string;
    }>(plugin);
    const { 'chainweaver-plugin-manifest': manifest } = packageJson;
    if (!manifest) {
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
    return {
      id: plugin,
      name: manifest.shortName,
      registry: '/internal-registry',
      description: manifest.description,
      version: packageJson.version,
      permissions: manifest.permissions,
    };
  });

  const pluginsJsonString = JSON.stringify(pluginsJson, null, 2);
  fs.writeFileSync(
    path.resolve(__dirname, './public/internal-registry/plugins.json'),
    pluginsJsonString,
  );
}
