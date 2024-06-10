import type { Command } from 'commander';
import ora from 'ora';
import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
// import { relativeToCwd } from '../../../utils/path.util.js';
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
    contractOptions.file(),
    contractOptions.contract(),
    contractOptions.namespace(),
    globalOptions.networkSelect({ isOptional: false }),
    globalOptions.chainId(),
    contractOptions.api(),
    contractOptions.parseTreePath(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('contract-generate:action', config);

    const loading = ora('Generating contract...').start();
    try {
      await services.pactjs.generate(config);

      loading.succeed('Contract generated successfully\n');

      log.info('====================================================');
      log.info('Contract details:');
      log.info('====================================================');
      log.info(config);
      log.info('====================================================\n');

      log.info(log.color.green('Output Location'));
      // log.info(relativeToCwd(config.outFile));

      log.output(null, {
        config,
      });
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
