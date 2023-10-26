import { Command, Option } from 'commander';
import { createPrincipal } from './create-principal';
import { createAccount, logger, sender00 } from './helper';
import { simulate } from './simulate';
import { transfer } from './transfer';

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
      let publicKey = args.key;
      if (publicKey === undefined) {
        const account = createAccount();
        publicKey = account.publicKey;
        logger.info('Account created:', account);
      }
      await transfer({ publicKey: publicKey, amount: args.amount });
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
    ).default(5),
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
      const principal = await createPrincipal({
        keys: [
          sender00.publicKey,
          '7bafb3968d7e57e832b450a873e9f562fbbdb109ef4b50575a9297cb8e37b140',
        ],
      });
      console.log(principal);
      // await simulate(args);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
