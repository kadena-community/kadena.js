import 'module-alias/register';

import type { IAccount } from '@devnet/utils';
import { logger } from '@utils/logger';
import { Command, Option } from 'commander';
import { simulateCoin } from './coin/simulate';
import { transfer } from './coin/transfer';
import { generateAccount } from './helper';
import { simulateMarmalade } from './marmalade/simulate';

const program: Command = new Command();
program
  .command('fund')
  .description('Fund an account on the devnet')
  .addOption(
    new Option('-k, --key <string>', 'Public key of the account to fund'),
  )
  .addOption(
    new Option(
      '-a, --amount <number>',
      'Amount to fund the account with',
    ).default('100'),
  )
  .action(async (args) => {
    try {
      let account: IAccount;
      if (args.key === undefined) {
        account = await generateAccount();
        logger.info('Account created:', account);
      } else {
        account = {
          account: `k:${args.key}`,
          keys: [{ publicKey: args.key, secretKey: '' }],
        };
      }

      await transfer({ receiver: account, amount: args.amount });
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('simulate:coin')
  .description('Simulate traffic on the devnet')
  .addOption(
    new Option(
      '-a, --numberOfAccounts <number>',
      'Number of accounts to create',
    ).default(6),
  )
  .addOption(
    new Option(
      '-i, --transferInterval <number>',
      'Transfer interval in milliseconds',
    ).default(100),
  )
  .addOption(
    new Option('-t, --maxAmount <number>', 'Maximum transfer amount').default(
      25,
    ),
  )
  .addOption(
    new Option(
      '-tp, --tokenPool <number>',
      'How much tokens are going to be circulating in the simulation',
    ).default(1000000),
  )
  .addOption(
    new Option('-s, --seed <string>', 'Seed for the random number').default(
      Date.now().toString(),
    ),
  )
  .action(async (args) => {
    try {
      logger.info('Simulation config parameters:', args);
      await simulateCoin(args);
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('simulate:marmalade')
  .description('Deploy marmalade contracts on the devnet')
  .addOption(
    new Option(
      '-a, --numberOfAccounts <number>',
      'Number of accounts to create',
    ).default(8),
  )
  .addOption(
    new Option(
      '-i, --transferInterval <number>',
      'Transfer interval in milliseconds',
    ).default(100),
  )
  .addOption(
    new Option(
      '-mt, --maximumMintValue <number>',
      'Maximum amount a token can be minted at once',
    ).default(25),
  )
  .addOption(
    new Option('-s, --seed <string>', 'Seed for the random number').default(
      Date.now().toString(),
    ),
  )
  .action(async (args) => {
    try {
      logger.info('Simulation config parameters:', args);
      await simulateMarmalade(args);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
