import { spawnSync } from 'child_process';
import type { Command } from 'commander';
import { join } from 'path';

import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';

export const createDappCommand: (program: Command, version: string) => void =
  createCommand(
    'create',
    'Create a new dapp project',
    [globalOptions.dappTemplate()],
    async (config, args) => {
      log.debug('dapp-create-command', { config });
      if (args[0] === undefined) {
        log.error(
          log.color.red(
            'Project name is required, e.g. `kadena dapp create my-dapp`',
          ),
        );
        process.exit(1);
      }
      const projectDir = join(process.cwd(), args[0]);
      const { dappTemplate } = config;

      const folderExists =
        await services.filesystem.directoryExists(projectDir);

      if (folderExists) {
        log.error(`Project directory ${args[0]} already exists`);
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
