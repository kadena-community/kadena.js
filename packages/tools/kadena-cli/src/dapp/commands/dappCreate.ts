import { spawnSync } from 'child_process';
import type { Command } from 'commander';
import { join } from 'path';

import { services } from '../../services/index.js';
import { CommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { dappOptions } from '../dappOptions.js';

export const createDappCommand: (program: Command, version: string) => void =
  createCommand(
    'add',
    'Add a new dapp project',
    [dappOptions.dappTemplate()],
    async (option, { values }) => {
      const config = await option.dappTemplate();
      log.debug('dapp-create-command', config);

      if (values[0] === undefined) {
        throw new CommandError({
          errors: [
            'Project name is required, e.g. `kadena dapp create my-dapp`',
          ],
          exitCode: 1,
        });
      }
      const projectDir = join(process.cwd(), values[0]);

      const folderExists =
        await services.filesystem.directoryExists(projectDir);

      if (folderExists) {
        throw new CommandError({
          errors: [`Project directory ${values[0]} already exists`],
          exitCode: 1,
        });
      }

      const cmd = 'npx';
      const cmdArgs = [
        '@kadena/create-kadena-app',
        'generate-project',
        '-n',
        values[0],
        '-t',
        config.dappTemplate,
      ];
      spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
    },
  );
