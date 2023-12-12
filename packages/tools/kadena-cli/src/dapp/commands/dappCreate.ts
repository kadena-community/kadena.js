import chalk from 'chalk';
import { spawnSync } from 'child_process';
import type { Command } from 'commander';
import debug from 'debug';
import { existsSync } from 'fs';
import { join } from 'path';

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
      const isFolderExists = existsSync(projectDir);

      if (isFolderExists) {
        console.error(chalk.red(`Project directory ${args[0]} already exists`));
        process.exit(1);
      }

      const cmd = 'npx';
      const cmdArgs = [
        '--no-install',
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
