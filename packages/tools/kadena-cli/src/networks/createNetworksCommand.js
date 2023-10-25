import { defaultNetworksPath } from '../constants/networks.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { NetworksCreateOptions, networksCreateQuestions, } from './networksCreateQuestions.js';
import { displayNetworkConfig, writeNetworks } from './networksHelpers.js';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import debug from 'debug';
import path from 'path';
async function shouldProceedWithNetworkCreate(network) {
    const filePath = path.join(defaultNetworksPath, `${network}.yaml`);
    if (ensureFileExists(filePath)) {
        const overwrite = await select({
            message: `Your network (config) already exists. Do you want to update it?`,
            choices: [
                { value: 'yes', name: 'Yes' },
                { value: 'no', name: 'No' },
            ],
        });
        return overwrite === 'yes';
    }
    return true;
}
async function runNetworksCreate(program, version, args) {
    try {
        const responses = await collectResponses(args, networksCreateQuestions);
        const networkConfig = { ...args, ...responses };
        NetworksCreateOptions.parse(networkConfig);
        writeNetworks(networkConfig);
        displayNetworkConfig(networkConfig);
        const proceed = await select({
            message: 'Is the above network configuration correct?',
            choices: [
                { value: 'yes', name: 'Yes' },
                { value: 'no', name: 'No' },
            ],
        });
        if (proceed === 'no') {
            clearCLI(true);
            console.log(chalk.yellow("Let's restart the configuration process."));
            await runNetworksCreate(program, version, args);
        }
        else {
            console.log(chalk.green('Configuration complete. Goodbye!'));
        }
    }
    catch (e) {
        console.error(e);
        processZodErrors(program, e, args);
    }
}
export function createNetworksCommand(program, version) {
    program
        .command('create')
        .description('Create new network')
        .option('-n, --network <network>', 'Kadena network (e.g. "mainnet")')
        .option('-nid, --networkId <networkId>', 'Kadena network Id (e.g. "mainnet01")')
        .option('-h, --networkHost <networkHost>', 'Kadena network host (e.g. "https://api.chainweb.com")')
        .option('-e, --networkExplorerUrl <networkExplorerUrl>', 'Kadena network explorer (e.g. "https://explorer.chainweb.com/mainnet/tx/")')
        .action(async (args) => {
        debug('network-create:action')({ args });
        if (args.network &&
            !(await shouldProceedWithNetworkCreate(args.network.toLowerCase()))) {
            console.log(chalk.red('Network creation aborted.'));
            return;
        }
        await runNetworksCreate(program, version, args);
    });
}
