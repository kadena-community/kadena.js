import ora from 'ora';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import type { Predicate } from '../types.js';
import { createAccountOnMainnet } from '../utils/createAccountOnMainnet.js';

export const createAccountCreateCommand = createCommand(
  'create',
  'Create an account on mainnet',
  [
    accountOptions.accountName({ isOptional: true }),
    accountOptions.publicKeys({ isOptional: false }),
    accountOptions.predicate({ isOptional: false }),
    globalOptions.chainId({ isOptional: false }),
    accountOptions.fungible({
      isOptional: true,
      disableQuestion: true,
    }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);

    const newConfig = {
      ...config,
      fungible: config.fungible ?? 'coin',
    };

    log.debug('account-create:action', newConfig);

    const loader = ora('Creating account...\n').start();
    const result = await createAccountOnMainnet({
      ...newConfig,
      publicKeys: newConfig.publicKeysConfig,
      predicate: newConfig.predicate as Predicate,
    });

    assertCommandError(result, loader);
    log.info(log.color.green(`Account "${result.data}" created successfully`));
  },
);
