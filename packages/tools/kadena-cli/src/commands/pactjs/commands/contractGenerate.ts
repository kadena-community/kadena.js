import type { Command } from 'commander';
import ora from 'ora';
import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { contractOptions } from '../options/contractOptions.js';

export const createContractGenerateCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'contract-generate',
  'Generate client based on a contract',
  [
    contractOptions.clean(),
    contractOptions.capsInterface(),
    contractOptions.file({ isOptional: true }),
    contractOptions.contract({ isOptional: true }),
    contractOptions.namespace(),
    globalOptions.networkSelect({ isOptional: false }),
    globalOptions.chainId(),
    contractOptions.api(),
    contractOptions.parseTreePath(),
  ],
  async (option) => {
    const file = (await option.file()).file;
    const contract =
      file.length === 0 ? (await option.contract()).contract : undefined;
    const api = (await option.api()).api || undefined;
    const chainId = api ?? (await option.chainId()).chainId;

    const { namespace } = await option.namespace();
    const { networkConfig } = await option.network();
    const { capsInterface } = await option.capsInterface();
    const { parseTreePath: parseTreeOption } = await option.parseTreePath();
    const parseTreePath = parseTreeOption !== '' ? parseTreeOption : undefined;
    const { clean: cleanOption } = await option.clean();
    const clean = cleanOption === 'yes';

    if (file?.length === 0 && contract?.length === 0) {
      throw new Error('Either file or contract must be provided.');
    }

    const config = {
      clean,
      capsInterface,
      namespace,
      networkConfig,
      api,
      parseTreePath,
      chainId,
      network: networkConfig.network,
      ...(file.length > 0 ? { file } : { contract }),
    };

    log.debug('contract-generate:action', config);

    const loading = ora('Generating contract...').start();
    try {
      await services.pactjs.generate(config);
      loading.succeed('Contract generated successfully\n');
    } catch (error) {
      loading.fail('Failed to generate contract');
      if (error instanceof Error) {
        log.error(error.message);
      } else {
        throw error;
      }
    }
  },
);
