import type { ICommandResult } from '@kadena/client';
import { createClient } from '@kadena/client';
import type { ChainId } from '@kadena/types';
import type { Command } from 'commander';
import { z } from 'zod';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { generateClientUrl } from '../utils/txHelpers.js';
import { arbitraryCodeTemplate } from './templates/templates.js';
import { createTransaction } from './txCreateTransaction.js';

export const createTxLocalCommand: (program: Command, version: string) => void =
  createCommand(
    'local',
    'Submit pact code as a local call',
    [
      globalOptions.networkOptional({ disableQuestion: true }),
      globalOptions.chainIdOptional({ disableQuestion: true }),
    ],
    async (option, { values }) => {
      const { network, networkConfig } = await option.network();
      const { chainId } = await option.chainId();
      log.debug('tx:local', { network, networkConfig, chainId, values });

      const code = values[0];
      const templateChainId = (chainId ?? '0') as ChainId;
      const templateNetworkId = networkConfig?.networkId ?? 'testnet04';
      const templateNetworkHost =
        networkConfig?.networkHost ?? 'https://api.testnet.chainweb.com';
      const templateNetwork = networkConfig?.network ?? 'testnet';

      if (!code) {
        log.warning(`No code passed to command. use: kadena tx local '(pact)'`);
        return;
      }

      const transaction = await createTransaction(
        arbitraryCodeTemplate(code, templateChainId, templateNetworkId),
        {},
      );

      const client = createClient(
        generateClientUrl({
          chainId: templateChainId,
          network: templateNetwork,
          networkId: templateNetworkId,
          networkHost: templateNetworkHost,
          networkExplorerUrl: '',
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
