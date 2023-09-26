import { simulate } from './simulate';
import { transfer } from './transfer';

import { Command, Option } from 'commander';

const program: Command = new Command();
program
  .command('fund')
  .description('Fund an account on the devnet')
  .addOption(
    new Option(
      '-k, --key <string>',
      'Public key of the account to fund',
    ).makeOptionMandatory(true),
  )
  .addOption(
    new Option(
      '-a, --amount <number>',
      'Amount to fund the account with',
    ).default('100'),
  )
  .action(async (args) => {
    try {
      await transfer({ publicKey: args.key, amount: args.amount });
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('traffic')
  .description('Simulate traffic on the devnet')
  .addOption(
    new Option(
      '-a, --accounts <number>',
      'Number of accounts to create',
    ).default('2'),
  )
  .addOption(
    new Option(
      '-i, --timeInterval <number>',
      'Transfer interval in milliseconds',
    ).default('2000'),
  )
  .addOption(
    new Option('-t, --transferAmount <number>', 'Transfer amount').default(
      '10',
    ),
  )
  .action(async (args) => {
    try {
      console.log('Simulation config parameters:', args);
      await simulate(args.accounts, args.timeInverval, args.transferAmount);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
