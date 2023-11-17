import { Command, Option } from 'commander';
import { IAccount, generateAccount, logger } from '../helper';
import { multiSigTransfer } from '../multisig-transfer';
import { transfer } from '../transfer';
import { simulate } from './simulate';

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
          keys: [{ publicKey: args.key }],
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
      simulate(args);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
