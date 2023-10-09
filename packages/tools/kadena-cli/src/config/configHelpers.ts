import {
  configDefaults,
  projectPrefix,
  projectRootPath,
} from '../constants/config.js';
import { defaultNetworksPath } from '../constants/networks.js';
import type { TNetworksCreateOptions } from '../networks/networksCreateQuestions.js';
import { PathExists, writeFile } from '../utils/filesystem.js';
import { mergeConfigs, sanitizeFilename } from '../utils/helpers.js';

import type { TConfigOptions } from './configQuestions.js';

import chalk from 'chalk';
import type { WriteFileOptions } from 'fs';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Writes config to a file.
 *
 * @param {TConfigOptions} options - The set of configuration options.
 * @param {string} options.projectName - The name of the project.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 * @param {number} options.chainId - The ID representing the chain.
 * @returns {void} - No return value; the function writes directly to a file.
 */
export function writeProjectConfig(options: TConfigOptions): void {
  const { projectName } = options;
  const projectFilePath = path.join(
    projectRootPath,
    `/${projectPrefix}${sanitizeFilename(projectName).toLowerCase()}.yaml`,
  );

  const existingConfig: TConfigOptions = (PathExists(
    projectFilePath,
  ) as boolean)
    ? (yaml.load(readFileSync(projectFilePath, 'utf8')) as TConfigOptions)
    : { ...configDefaults };

  const projectConfig = mergeConfigs(existingConfig, options);

  writeFile(
    projectFilePath,
    yaml.dump(projectConfig),
    'utf8' as WriteFileOptions,
  );
}

/**
 * Displays the general configuration in a formatted manner.
 *
 * @param {TConfigOptions} config - The general configuration to display.
 */
export function displayGeneralConfig(config: TConfigOptions): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const formatConfig = (key: string, value?: string | number): string => {
    const valueDisplay =
      value !== undefined && value.toString().trim() !== ''
        ? chalk.green(value.toString())
        : chalk.red('Not Set');
    const keyValue = `${key}: ${valueDisplay}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  displaySeparator();
  log(formatConfig('Project Name', config.projectName));
  log(formatConfig('Network', config.network));
  log(formatConfig('Chain-ID', config.chainId));
  displaySeparator();
}

/**
 * Loads and returns the current configuration from the default root path.
 *
 * @returns {IDefaultConfigOptions} - The parsed configuration object.
 */
export function getProjectConfig(projectName: string): TConfigOptions {
  const projectConfigPath = path.join(projectRootPath, `${projectName}.yaml`);

  try {
    return yaml.load(readFileSync(projectConfigPath, 'utf8')) as TConfigOptions;
  } catch (e) {
    throw new Error(`Project config file '${projectName}' not found`);
  }
}

/**
 * Retrieves the current network configuration for the given project name.
 *
 * @function
 * @export
 * @param {string} projectName - The name of the project for which the network configuration is to be retrieved.
 *
 * @returns {TConfigOptions} The network configuration options for the provided project name.
 *
 * @throws Will throw an error if the network configuration file is not found or any error occurs during loading the network configuration.

 */
export function getCurrentNetworkConfigForProject(
  projectName: string,
): TConfigOptions {
  const projectConfig = getProjectConfig(projectName);
  const networkConfigPath = path.join(
    defaultNetworksPath,
    `/${projectConfig.network}.yaml`,
  );

  try {
    return yaml.load(readFileSync(networkConfigPath, 'utf8')) as TConfigOptions;
  } catch (e) {
    console.log(chalk.red(`error loading network config: ${e}`));
    throw Error('Network config file not found');
  }
}

type TCombinedConfigOptions = TConfigOptions & TNetworksCreateOptions;

function combineConfigs(
  projectConfig: TConfigOptions,
  networkConfig: TNetworksCreateOptions,
): TCombinedConfigOptions {
  return { ...projectConfig, ...networkConfig };
}

export function getCombinedConfig(projectName: string): TCombinedConfigOptions {
  const projectConfig = getProjectConfig(projectName);
  const networkConfig = getCurrentNetworkConfigForProject(projectName);

  return combineConfigs(projectConfig, networkConfig);
}
