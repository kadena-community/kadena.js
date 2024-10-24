import type { ICommandResult } from '@kadena/client';
import { createClient } from '@kadena/client';
import type { ChainId } from '@kadena/types';
import type { Command } from 'commander';
import { z } from 'zod';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { getDefaultNetworkName } from '../../../utils/helpers.js';
import { log } from '../../../utils/logger.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import { getNetworks } from '../../networks/utils/networkHelpers.js';
import { txOptions } from '../txOptions.js';
import { generateClientUrl } from '../utils/txHelpers.js';
import { arbitraryCodeTemplate } from './templates/templates.js';
import { createTransaction } from './txCreateTransaction.js';

async function getNetworkConfig(flagConfig: INetworkCreateOptions | null) {
  if (flagConfig) return flagConfig;
  const networks = await getNetworks();
  const defaultName = await getDefaultNetworkName();
  const defaultNetwork =
    defaultName !== undefined
      ? networks.find((network) => network.network === defaultName)
      : undefined;
  if (defaultNetwork) return defaultNetwork;
  const mainNetwork = networks.find(
    (network) => network.networkId === 'testnet04',
  );
  if (mainNetwork) return mainNetwork;
  return null;
}

export const createTxLocalCommand: (program: Command, version: string) => void =
  createCommand(
    'local',
    'Submit pact code as a local call',
    [
      globalOptions.networkOptional({ disableQuestion: true }),
      globalOptions.chainIdOptional({ disableQuestion: true }),
      txOptions.gasLimit({ disableQuestion: true }),
    ],
    async (option, { values }) => {
      const { networkConfig } = await option.network();
      const { chainId } = await option.chainId();
      const { gasLimit } = await option.gasLimit();
      log.debug('tx:local', { networkConfig, chainId, gasLimit, values });

      const network = await getNetworkConfig(networkConfig);
      if (!network) {
        return log.warning(
          `Could not select a network to use. Set a default network or use the --network flag.`,
        );
      }
      log.debug('tx:local', { network });

      const code = values[0];
      const templateChainId = (chainId ?? '0') as ChainId;

      if (!code) {
        log.warning(`No code passed to command. use: kadena tx local '(pact)'`);
        return;
      }

      const transaction = await createTransaction(
        {
          code,
          'chain-id': templateChainId,
          'network:networkId': network.networkId,
          gasLimit: gasLimit ?? '3000',
        },
        arbitraryCodeTemplate,
      );

      const client = createClient(
        generateClientUrl({
          chainId: templateChainId,
          ...network,
        }),
      );

      const response = await client
        .local(transaction, {
          preflight: false,
          signatureVerification: false,
        })
        .catch((error) => {
          return {
            result: {
              status: 'failure',
              error: { message: String(error.message ?? error) },
            },
          } as ICommandResult;
        });

      log.info(
        log.color.green(
          `Local transaction on network ${network.network} chain ${templateChainId}:`,
        ),
      );
      if (response.result.status === 'success') {
        log.output(JSON.stringify(response.result.data), response.result.data);
      } else {
        const parsed = z
          .object({ message: z.string() })
          .safeParse(response.result.error);
        if (parsed.success) {
          log.warning(`Error from local call:\n${parsed.data.message}`);
        } else {
          log.warning(JSON.stringify(response.result.error));
        }
      }
    },
  );
