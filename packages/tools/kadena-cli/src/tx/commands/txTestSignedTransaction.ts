import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import { createClient, isSignedTransaction } from '@kadena/client';
import type { ICommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { getTransactionFromFile } from '../utils/helpers.js';
import { txDisplayTransaction } from '../utils/txDisplayHelper.js';

export const testTransactionAction = async (
  signedCommand: ICommand,
  networkConfig: {
    networkHost: string;
    networkId: string;
  },
  chainId: string,
): Promise<CommandResult<{}>> => {
  const client = createClient(
    `${networkConfig.networkHost}/chainweb/0.0/${networkConfig.networkId}/chain/${chainId}/pact`,
  );

  try {
    const response = await client.local(signedCommand, {
      preflight: false,
      signatureVerification: true,
    });
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signedTransasction: ${error.message}`],
    };
  }
};

export const createTestSignedTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommandFlexible(
  'test-signed-transaction',
  'test a signed transaction.',
  [
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.txSignedTransactionFile(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (option) => {
    const networkOption = await option.network();
    const dir = await option.txTransactionDir();
    const file = await option.txSignedTransactionFile({
      signed: true,
      path: dir.txTransactionDir,
    });
    const chainOption = await option.chainId();

    debug.log('sign-with-local-wallet:action', {
      ...networkOption,
      ...dir,
      ...file,
      ...chainOption,
    });

    const txSignedTransaction = await getTransactionFromFile(
      file.txSignedTransactionFile,
      true,
      dir.txTransactionDir,
    );

    if (isSignedTransaction(txSignedTransaction)) {
      const result = await testTransactionAction(
        txSignedTransaction,
        networkOption.networkConfig,
        chainOption.chainId,
      );
      assertCommandError(result);
      return txDisplayTransaction(result.data, 'txSignedTransaction result:');
    }
    console.error(chalk.red(`\nErreor: Transaction is not signed \n`));
  },
);
