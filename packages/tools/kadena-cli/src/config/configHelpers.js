import { configDefaults, projectPrefix, projectRootPath, } from '../constants/config.js';
import { defaultNetworksPath } from '../constants/networks.js';
import { PathExists, writeFile } from '../utils/filesystem.js';
import { mergeConfigs, sanitizeFilename } from '../utils/helpers.js';
import chalk from 'chalk';
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
export function writeProjectConfig(options) {
    const { projectName } = options;
    const projectFilePath = path.join(projectRootPath, `/${projectPrefix}${sanitizeFilename(projectName).toLowerCase()}.yaml`);
    const existingConfig = PathExists(projectFilePath)
        ? yaml.load(readFileSync(projectFilePath, 'utf8'))
        : { ...configDefaults };
    const projectConfig = mergeConfigs(existingConfig, options);
    writeFile(projectFilePath, yaml.dump(projectConfig), 'utf8');
}
/**
 * Displays the general configuration in a formatted manner.
 *
 * @param {TConfigOptions} config - The general configuration to display.
 */
export function displayGeneralConfig(config) {
    const log = console.log;
    const formatLength = 80; // Maximum width for the display
    const displaySeparator = () => {
        log(chalk.green('-'.padEnd(formatLength, '-')));
    };
    const formatConfig = (key, value) => {
        const valueDisplay = value !== undefined && value.toString().trim() !== ''
            ? chalk.green(value.toString())
            : chalk.red('Not Set');
        const keyValue = `${key}: ${valueDisplay}`;
        const remainingWidth = formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
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
export function getProjectConfig(projectName) {
    const projectConfigPath = path.join(projectRootPath, `${projectName}.yaml`);
    try {
        return yaml.load(readFileSync(projectConfigPath, 'utf8'));
    }
    catch (e) {
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
export function getCurrentNetworkConfigForProject(projectName) {
    const projectConfig = getProjectConfig(projectName);
    const networkConfigPath = path.join(defaultNetworksPath, `/${projectConfig.network}.yaml`);
    try {
        return yaml.load(readFileSync(networkConfigPath, 'utf8'));
    }
    catch (e) {
        console.log(chalk.red(`error loading network config: ${e}`));
        throw Error('Network config file not found');
    }
}
function combineConfigs(projectConfig, networkConfig) {
    return { ...projectConfig, ...networkConfig };
}
export function getCombinedConfig(projectName) {
    const projectConfig = getProjectConfig(projectName);
    const networkConfig = getCurrentNetworkConfigForProject(projectName);
    return combineConfigs(projectConfig, networkConfig);
}
