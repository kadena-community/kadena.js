import { projectPrefix, projectRootPath } from '../constants/config.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import {
  displayGeneralConfig,
  getProjectConfig,
  writeProjectConfig,
} from './configHelpers.js';
import type { TConfigOptions } from './configQuestions.js';
import { ConfigOptions, configQuestions } from './configQuestions.js';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import { Option } from 'commander';
import debug from 'debug';
import path from 'path';

async function shouldProceedWithConfigInit(
  projectName: string,
): Promise<boolean> {
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

async function runConfigInitialization(
  program: Command,
  version: string,
  args: TConfigOptions,
): Promise<void> {
  try {
    // ./bin/kadena-cli.js contract deploy --network mainnet
    // args
    // missign args via collectResponses
    // - chainId
    // - keys
    const responses = await collectResponses(args, configQuestions);

    // - chainId 1-5
    // - keys hd blaat
    // - keys-hd-index 0-50
    const config = { ...args, ...responses };
    // final arguments
    // show command with all arguments

    // build/extend config based on arguments
    // nework: mainnet
    // - networkId: mainnet01
    // - networkHost: http://risetnirsetn
    // keys:
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // -  public: irestn secret: riest
    // const commandConfig = postProcessing(finalResponses)

    // execute command
    ConfigOptions.parse(config);

    writeProjectConfig(config);

    displayGeneralConfig(
      // new project don't have a prefix yet
      getProjectConfig(`${projectPrefix}${config.projectName.toLowerCase()}`),
    );

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
    } else {
      console.log(chalk.green('Configuration complete. Goodbye!'));
    }
  } catch (e) {
    console.error(e);
    processZodErrors(program, e, args);
  }
}

export function initCommand(program: Command, version: string): void {
  program
    .command('init')
    .description(
      'Configuration of Project. E.g. context, network, config directory.',
    )
    .option('-p, --projectName <projectName>', 'Name of project')
    .option(
      '-n, --defaultNetwork <defaultNetwork>',
      'Kadena network (e.g. "mainnet")',
    )
    .addOption(
      new Option('-c, --chainId <number>', 'Chain to retrieve from)').argParser(
        (value) => parseInt(value, 10),
      ),
    )
    .action(async (args: TConfigOptions) => {
      debug('init:action')({ args });
      /**
       * 1. config init voor bootstrap `.kadena`
       * 2. bootstrap doen we alleen bij `config init` OF
       *    - elke call van een ander commando moet checken of de folder bestaat,
       *      zo niet automatisch aanmaken,
       *      - directories: devnet, keys, networks
       *      - in networks: mainnet.yml, testnet.yml, devnet.yml
       * 3. project.yml kan weg
       * 4. elke action bestaat uit de volgende stappen
       *    - args komen binnen
       *    - `collectResponses` obv missing args
       *        - arg name is globally unique, overal betekent een arg hetzelfde
       *        - per command worden dus een subset van questions gesteld
       *    - convert "args + responses + config" => "commandConfig"
       *    - show final command obv args + responses
       *    - show overzicht van alle configuratie opties
       */

      if (
        args.projectName &&
        !(await shouldProceedWithConfigInit(args.projectName))
      ) {
        console.log(chalk.yellow('Config initialization cancelled.'));
        return;
      }

      // TODO: make this fix nicer
      await import('./../utils/bootstrap.js');

      await runConfigInitialization(program, version, args);
    });
}
