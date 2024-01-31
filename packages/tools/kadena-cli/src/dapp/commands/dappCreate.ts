import chalk from 'chalk';
import { spawnSync } from 'child_process';
import type { Command } from 'commander';
import debug from 'debug';
import { join } from 'path';

import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const createDappCommand: (program: Command, version: string) => void =
  createCommand(
    'create',
    'create a new dapp project',
    [globalOptions.dappTemplate()],
    async (config, args) => {
      debug('dapp-create-command')({ config });
      if (args[0] === undefined) {
        console.error(chalk.red('Project name is required'));
        process.exit(1);
      }
      const projectDir = join(process.cwd(), args[0]);
      const { dappTemplate } = config;

      const folderExists =
        await services.filesystem.directoryExists(projectDir);

      if (folderExists) {
        console.error(chalk.red(`Project directory ${args[0]} already exists`));
        process.exit(1);
      }

      const cmd = 'npx';
      const cmdArgs = [
        '@kadena/create-kadena-app',
        'generate-project',
        '-n',
        args[0],
        '-t',
        dappTemplate,
      ];
      spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
    },
  );
