import { defaultNetworksPath, networkDefaults } from '../constants/networks.js';
import { PathExists, writeFile } from '../utils/filesystem.js';
import { getExistingNetworks, mergeConfigs, sanitizeFilename, } from '../utils/helpers.js';
import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
/**
 * Writes the given network setting to the networks folder
 *
 * @param {TNetworksCreateOptions} options - The set of configuration options.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 * @param {number} options.networkId - The ID representing the network.
 * @param {string} options.networkHost - The hostname for the network.
 * @param {string} options.networkExplorerUrl - The URL for the network explorer.
 * @returns {void} - No return value; the function writes directly to a file.
 */
export function writeNetworks(options) {
    const { network } = options;
    const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
    const networkFilePath = path.join(defaultNetworksPath, `${sanitizedNetwork}.yaml`);
    let existingConfig;
    if (PathExists(networkFilePath)) {
        existingConfig = yaml.load(readFileSync(networkFilePath, 'utf8'));
    }
    else {
        // Explicitly check if network key exists in networkDefaults and is not undefined
        existingConfig =
            typeof networkDefaults[network] !== 'undefined'
                ? { ...networkDefaults[network] }
                : { ...networkDefaults.other };
    }
    const networkConfig = mergeConfigs(existingConfig, options);
    writeFile(networkFilePath, yaml.dump(networkConfig), 'utf8');
}
/**
 * Displays the network configuration in a formatted manner.
 *
 * @param {TNetworksCreateOptions} networkConfig - The network configuration to display.
 */
export function displayNetworkConfig(networkConfig) {
    const log = console.log;
    const formatLength = 80; // Maximum width for the display
    const displaySeparator = () => {
        log(chalk.green('-'.padEnd(formatLength, '-')));
    };
    const formatConfig = (key, value) => {
        const valueDisplay = value !== undefined && value.trim() !== ''
            ? chalk.green(value)
            : chalk.red('Not Set');
        const keyValue = `${key}: ${valueDisplay}`;
        const remainingWidth = formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
        return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
    };
    displaySeparator();
    log(formatConfig('Network', networkConfig.network));
    log(formatConfig('Network ID', networkConfig.networkId));
    log(formatConfig('Network Host', networkConfig.networkHost));
    log(formatConfig('Network Explorer URL', networkConfig.networkExplorerUrl));
    displaySeparator();
}
export function displayNetworksConfig() {
    const log = console.log;
    const formatLength = 80; // Maximum width for the display
    const displaySeparator = () => {
        log(chalk.green('-'.padEnd(formatLength, '-')));
    };
    const formatConfig = (key, value, isDefault) => {
        const valueDisplay = (value?.trim() ?? '') !== '' ? chalk.green(value) : chalk.red('Not Set');
        const defaultIndicator = isDefault === true ? chalk.yellow(' (Using defaults)') : '';
        const keyValue = `${key}: ${valueDisplay}${defaultIndicator}`;
        const remainingWidth = formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
        return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
    };
    const existingNetworks = getExistingNetworks();
    const standardNetworks = ['mainnet', 'testnet'];
    existingNetworks.forEach(({ value }) => {
        const networkFilePath = path.join(defaultNetworksPath, `${value}.yaml`);
        const fileExists = existsSync(networkFilePath);
        const networkConfig = fileExists
            ? yaml.load(readFileSync(networkFilePath, 'utf8'))
            : networkDefaults[value];
        displaySeparator();
        log(formatConfig('Network', value, !fileExists));
        log(formatConfig('Network ID', networkConfig.networkId, !fileExists));
        log(formatConfig('Network Host', networkConfig.networkHost, !fileExists));
        log(formatConfig('Network Explorer URL', networkConfig.networkExplorerUrl, !fileExists));
    });
    standardNetworks.forEach((network) => {
        if (!existingNetworks.some(({ value }) => value === network)) {
            const networkConfig = networkDefaults[network];
            displaySeparator();
            log(formatConfig('Network', network, true)); // as it is a standard network and does not exist in existingNetworks
            log(formatConfig('Network ID', networkConfig.networkId, true));
            log(formatConfig('Network Host', networkConfig.networkHost, true));
            log(formatConfig('Network Explorer URL', networkConfig.networkExplorerUrl, true));
        }
    });
    displaySeparator();
}
