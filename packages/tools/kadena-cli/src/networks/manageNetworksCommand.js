import { defaultNetworksPath } from '../constants/networks.js';
import { clearCLI, collectResponses, getExistingNetworks, } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { networkManageQuestions, NetworksCreateOptions, } from './networksCreateQuestions.js';
import { writeNetworks } from './networksHelpers.js';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
export function manageNetworks(program, version) {
    program
        .command('manage')
        .description('Manage network(s)')
        .action(async (args) => {
        try {
            const existingNetworks = getExistingNetworks();
            if (existingNetworks.length === 0) {
                console.log(chalk.red('No existing networks found.'));
                return;
            }
            const selectedNetwork = await select({
                message: 'Select the network you want to manage:',
                choices: existingNetworks,
            });
            const networkFilePath = path.join(defaultNetworksPath, `${selectedNetwork}.yaml`);
            const existingConfig = yaml.load(readFileSync(networkFilePath, 'utf8'));
            const responses = await collectResponses({ network: selectedNetwork }, networkManageQuestions);
            const networkConfig = { ...existingConfig, ...responses };
            NetworksCreateOptions.parse(networkConfig);
            writeNetworks(networkConfig);
            clearCLI();
            console.log(chalk.green('Network configurations updated.'));
        }
        catch (e) {
            processZodErrors(program, e, args);
        }
    });
}
