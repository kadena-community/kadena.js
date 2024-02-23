import { spawnSync } from 'child_process';
import type { Command } from 'commander';
import { join } from 'path';

import { services } from '../../services/index.js';
import { CommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const createDappCommand: (program: Command, version: string) => void =
  createCommandFlexible(
    'add',
    'Add a new dapp project',
    [globalOptions.dappTemplate()],
    async (option, values) => {
      // log.debug('dapp-create-command', { config });
      const { dappTemplate } = await option.dappTemplate();

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
        dappTemplate,
      ];
      spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
    },
  );
