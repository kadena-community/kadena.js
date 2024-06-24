import type { Command } from 'commander';
import ora from 'ora';
import { join } from 'path';
import { services } from '../../../services/index.js';
import { getChainId } from '../../../services/pactjs/utils/chainHelpers.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { contractOptions } from '../options/contractOptions.js';

export const createRetrieveContractCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'retrieve-contract',
  'Retrieve a contract from an API using a / local call',
  [
    contractOptions.module(),
    contractOptions.out(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
    contractOptions.api({ isOptional: true }),
  ],
  async (option) => {
    const { module } = await option.module();
    const { networkConfig } = await option.network();
    const apiOption = await option.api();
    const api = apiOption.api || undefined;
    const chainId =
      api !== undefined && api !== ''
        ? getChainId(api)
        : (await option.chainId()).chainId;
    const { out } = await option.out();

    log.debug('retrieve-contract:action', {
      module,
      networkConfig,
      api,
      chainId,
      out,
    });

    const loading = ora('Retrieving contract...').start();
    try {
      const code = await services.pactjs.retrieveContractFromChain(
        module,
        chainId,
        networkConfig.network,
        networkConfig,
        api,
      );
      if (code !== undefined && code.length !== 0) {
        await services.filesystem.writeFile(join(process.cwd(), out), code);
        loading.succeed('Contract retrieved...');
        log.info(`Contract saved to: ${join(process.cwd(), out)}`);
      }
    } catch (error) {
      loading.fail('Failed to retrieve contract');
      if (error instanceof Error) {
        log.error(error.message);
      } else {
        throw error;
      }
    }
  },
);
