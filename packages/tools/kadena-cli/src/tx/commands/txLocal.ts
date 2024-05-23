import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { printTx } from '../utils/txDisplayHelper.js';
import { getAllTransactions } from '../utils/txHelpers.js';

export const createTxLocalCommand: (program: Command, version: string) => void =
  createCommand(
    'local',
    'Submit pact code as a local call',
    [
      globalOptions.network({ disableQuestion: true }),
      globalOptions.chainId({ disableQuestion: true }),
    ],
    async (option, { values }) => {
      const { network } = await option.network();
      const { chainId } = await option.chainId();
      log.debug('tx:local', { network, chainId, values });

      console.log(values);
    },
  );
