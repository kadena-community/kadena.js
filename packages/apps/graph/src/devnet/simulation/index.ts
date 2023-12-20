import { Command, Option } from 'commander';

import 'module-alias/register';

import { createToken } from '@devnet/marmalade/token/create-token';
import { createTokenId } from '@devnet/marmalade/token/create-token-id';
import { mintToken } from '@devnet/marmalade/token/mint-token';
import { transferCreateToken } from '@devnet/marmalade/token/transfer-create-token';
import { PactNumber } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';
import type { IAccount } from '../helper';
import { generateAccount, logger, sender00 } from '../helper';
import { deployMarmaladeContracts } from '../marmalade/deploy';
import { transfer } from '../transfer';
import { simulate } from './simulate';
import { simulateMarmalade } from './simulate-marmalade';

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
  .command('traffic')
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
      await simulate(args);
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('marmalade')
  .description('Deploy marmalade contracts on the devnet')
  .action(async (args) => {
    try {
      await deployMarmaladeContracts(sender00);
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('test')
  .description('Deploy marmalade contracts on the devnet')
  .action(async (args) => {
    try {
      await simulateMarmalade(args);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
