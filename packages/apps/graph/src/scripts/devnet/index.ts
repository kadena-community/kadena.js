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
      '-a, --noAccounts <number>',
      'Number of accounts to create',
    ).default(5),
  )
  .addOption(
    new Option(
      '-i, --transferInterval <number>',
      'Transfer interval in milliseconds',
    ).default(3000),
  )
  .addOption(
    new Option('-t, --maxAmount <number>', 'Maximumansfer amount').default(25),
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
      console.log('Simulation config parameters:', args);
      await simulate(args);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
