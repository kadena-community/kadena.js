import { execSync } from 'child_process';
import type { Command } from 'commander';
import debug from 'debug';
import { existsSync } from 'fs';
import { join } from 'path';

import chalk from 'chalk';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const createDappCommand: (program: Command, version: string) => void =
  createCommand(
    'create',
    'create a new dapp project',
    [globalOptions.dappTemplate()],
    async (config, args) => {
      const projectDir = join(process.cwd(), args[0]);
      const { dappTemplate } = config;
      console.log({
        args,
        projectDir,
      });
      debug('dapp-create-command')({ config });
      const isFolderExists = existsSync(projectDir);
      console.log(`isFolderExists: ${isFolderExists}`);
      if (isFolderExists) {
        console.error(chalk.red(`Project directory ${args[0]} already exists`));
        process.exit(1);
      }

      console.log(`Creating ${dappTemplate} project at ${args[0]}`);
      // generate-project -n [project-name] -t [template-name]
      execSync(
        `npx @kadena/create-kadena-app generate-project -n ${args[0]} -t ${dappTemplate}`,
      );

      console.log(chalk.green(`Project ${args[0]} created successfully`));
      return;
    },
  );
