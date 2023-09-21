import { simulate } from './simulate';

import { Command, Option } from 'commander';

const program = new Command();
program
  .description('Simulate traffic on the devnet')
  .addOption(
    new Option(
      '-a, --accounts <number>',
      'Number of accounts to create',
    ).default('2'),
  )
  .addOption(
    new Option(
      '-i, --timeInverval <number>',
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
