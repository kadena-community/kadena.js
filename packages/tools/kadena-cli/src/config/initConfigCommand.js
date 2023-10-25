import { projectPrefix, projectRootPath } from '../constants/config.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { displayGeneralConfig, getProjectConfig, writeProjectConfig, } from './configHelpers.js';
import { ConfigOptions, configQuestions } from './configQuestions.js';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { Option } from 'commander';
import debug from 'debug';
import path from 'path';
async function shouldProceedWithConfigInit(projectName) {
    const filePath = path.join(projectRootPath, `${projectName}.yaml`);
    if (ensureFileExists(filePath)) {
        const overwrite = await select({
            message: `Your config already exists. Do you want to update it?`,
            choices: [
                { value: 'yes', name: 'Yes' },
                { value: 'no', name: 'No' },
            ],
        });
        return overwrite === 'yes';
    }
    return true;
}
async function runConfigInitialization(program, version, args) {
    try {
        const responses = await collectResponses(args, configQuestions);
        const config = { ...args, ...responses };
        ConfigOptions.parse(config);
        writeProjectConfig(config);
        displayGeneralConfig(
        // new project don't have a prefix yet
        getProjectConfig(`${projectPrefix}${config.projectName.toLowerCase()}`));
        const proceed = await select({
            message: 'Is the above configuration correct?',
            choices: [
                { value: 'yes', name: 'Yes' },
                { value: 'no', name: 'No' },
            ],
        });
        if (proceed === 'no') {
            clearCLI(true);
            console.log(chalk.yellow("Let's restart the configuration process."));
            await runConfigInitialization(program, version, args);
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
export function initCommand(program, version) {
    program
        .command('init')
        .description('Configuration of Project. E.g. context, network, config directory.')
        .option('-p, --projectName <projectName>', 'Name of project')
        .option('-n, --defaultNetwork <defaultNetwork>', 'Kadena network (e.g. "mainnet")')
        .addOption(new Option('-c, --chainId <number>', 'Chain to retrieve from)').argParser((value) => parseInt(value, 10)))
        .action(async (args) => {
        debug('init:action')({ args });
        if (args.projectName &&
            !(await shouldProceedWithConfigInit(args.projectName))) {
            console.log(chalk.yellow('Config initialization cancelled.'));
            return;
        }
        // TODO: make this fix nicer
        await import('./../utils/bootstrap.js');
        await runConfigInitialization(program, version, args);
    });
}
