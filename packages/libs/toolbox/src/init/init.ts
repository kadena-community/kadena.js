import { exec } from 'child_process';
import { writeFile } from 'node:fs/promises';
import { addDependency, detectPackageManager } from 'nypm';
import { join } from 'pathe';
import {
  readPackageJSON,
  readTSConfig,
  resolvePackageJSON,
  resolveTSConfig,
  writePackageJSON,
  writeTSConfig,
} from 'pkg-types';
import { logger } from '../utils';
import { createHelloWorld } from './hello';

export function defaultConfigTemplate(contractDir: string) {
  return `{
    defaultNetwork: 'local',
    pact: {
      contractsDir: '${contractDir}',
    },
    networks: {
      local: createLocalNetworkConfig({
        serverConfig: {
          port: 9001,
        },
      }),
      devnet: createDevNetNetworkConfig({
        containerConfig: {
          image: 'kadena/devnet',
          tag: 'latest',
          name: 'devnet',
        },
      }),
    },
  }`;
}

export function generateCJSConfigTemplate(contractDir: string) {
  return `const {  createDevNetNetworkConfig, createLocalNetworkConfig, defineConfig } = require('@kadena/toolbox');

module.exports = defineConfig(${defaultConfigTemplate(contractDir)});`;
}

export function generateESMConfigTemplate(contractDir: string) {
  return `import { createDevNetNetworkConfig, createLocalNetworkConfig, defineConfig } from '@kadena/toolbox';

export default defineConfig(${defaultConfigTemplate(contractDir)});`;
}

export function generateConfigTemplate(contractDir: string, isCJS: boolean) {
  return isCJS
    ? generateCJSConfigTemplate(contractDir)
    : generateESMConfigTemplate(contractDir);
}

export const NPM_SCRIPTS = {
  'kadena:start': 'kadena toolbox start',
  'kadena:run': 'kadena toolbox start',
  'kadena:prelude': 'kadena toolbox prelude',
  'kadena:types': 'kadena toolbox types',
  'kadena:test': 'kadena toolbox test',
};

export interface InitToolboxArgs {
  cwd: string;
  contractsDir: string;
}
export async function initToolbox(args: InitToolboxArgs) {
  const packageJsonPath = await resolvePackageJSON();
  const tsConfigPath = await resolveTSConfig();
  const packageJson = await readPackageJSON(packageJsonPath);
  const tsConfig = await readTSConfig(tsConfigPath);

  const isCJS = packageJson.type !== 'module';
  const isTypescript = !!tsConfig;
  const template = generateConfigTemplate(args.contractsDir, isCJS);

  const deps = ['@kadena/client', '@kadena/client-utils'];
  const devDeps = ['@kadena/cli', '@kadena/toolbox'];
  logger.start(`Installing dependencies ${deps.join(', ')} ...`);
  const packageManager = await detectPackageManager(args.cwd, {
    includeParentDirs: true,
  });
  for (const dep of deps) {
    await addDependency(dep, { cwd: args.cwd, silent: true, packageManager });
    logger.success(`Installed ${dep}`);
  }
  for (const dep of devDeps) {
    await addDependency(dep, {
      cwd: args.cwd,
      dev: true,
      silent: true,
      packageManager,
    });
    logger.success(`Installed ${dep}`);
  }
  const configPath = isTypescript
    ? 'kadena-toolbox.config.ts'
    : 'kadena-toolbox.config.js';
  await writeFile(join(args.cwd, configPath), template);
  logger.success(`Config file created at ${configPath}`);

  // add pact:* scripts to package.json
  try {
    for (const [scriptName, scriptCommand] of Object.entries(NPM_SCRIPTS)) {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts[scriptName] = scriptCommand;
    }
    await writePackageJSON(packageJsonPath, packageJson);
  } catch (e) {
    logger.warn(
      `Failed to add pact:* scripts to package.json at ${packageJsonPath}, please add manually`,
    );
  }

  // update tsconfig.json to add ".kadena/pactjs-generated" in the types array
  try {
    if (tsConfig) {
      tsConfig.compilerOptions = tsConfig.compilerOptions || {};
      tsConfig.compilerOptions.types = tsConfig.compilerOptions.types || [];
      if (
        !tsConfig.compilerOptions.types.includes('.kadena/pactjs-generated')
      ) {
        tsConfig.compilerOptions.types.push('.kadena/pactjs-generated');
      }
      await writeTSConfig(tsConfigPath, tsConfig);
    }
  } catch (e) {
    logger.warn(
      `Failed to add ".kadena/pactjs-generated" to the types array in tsconfig.json at ${tsConfigPath}, please add manually`,
    );
  }
  await createHelloWorld(join(args.cwd, args.contractsDir));

  // fetch preludes
  exec('npm run pact:prelude', { cwd: args.cwd });
  logger.box(`You are ready to go!`);
}
