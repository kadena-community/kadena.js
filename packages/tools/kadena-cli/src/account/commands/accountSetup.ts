import debug from 'debug';
import type { Command } from 'commander';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';

import { createCommand } from "../../utils/createCommand.js";
import { globalOptions } from "../../utils/globalOptions.js";

export const addAccountSetupCommand: (program: Command, version: string) => void = createCommand(
  'add',
  'Add an existing account to the CLI',
  [
    globalOptions.manual(),
    globalOptions.fromWallet(),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addAccount(config: any): Promise<void> {
    debug('account-add:action')({ config });
    const { accountFromWallet, manual, fromWallet } = config;

    // Since we set the default value of accountFromWallet to false when manual is true, so we can check fromWallet
    // to see if the user passed in the --from-wallet flag.
    const isWallet = fromWallet === true || accountFromWallet === true;

    if(manual === true && isWallet === true) {
      console.log(
        chalk.red(`\nYou cannot use both --manual and --wallet at the same time.\n`),
      );
      return;
    }

    if(manual === false && accountFromWallet === false) {
      const setup = await select({
        message: 'How do you want to setup your account?',
        choices: [
          { value: 'manual', name: 'Manual' },
          { value: 'wallet', name: 'From wallet' },
        ],
      });

      if(setup === 'wallet') {
        Object.assign(config, { accountFromWallet: true });
      }

      if(setup === 'manual') {
        Object.assign(config, { manual: true });
      }
      console.log({ setup });
    }
  }
);
