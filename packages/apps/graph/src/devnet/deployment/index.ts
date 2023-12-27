import 'module-alias/register';

import { sender00 } from '@devnet/utils';
import type { ChainId } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';
import { Option, program } from 'commander';
import { deployMarmaladeContracts } from './marmalade/deploy';

program
  .command('deploy:marmalade')
  .description('Deploy marmalade contracts on the devnet')
  .addOption(
    new Option('-c --chainId <string>', 'Chain Id to deploy to').default(
      dotenv.SIMULATE_DEFAULT_CHAIN_ID,
    ),
  )
  .action(async (args) => {
    try {
      const chainId = args.chainId.split(',') as ChainId[];
      logger.info('Deploying marmalade contracts on chains:', chainId);
      await deployMarmaladeContracts(sender00, chainId);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
