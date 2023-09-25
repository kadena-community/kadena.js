import { simulate } from './simulate';
import { transfer } from './transfer';

import { Command, Option } from 'commander';

const program = new Command();
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
      await transfer(args.key, undefined, args.amount);
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
      // const amount: string = '10';
      // // change these two accounts with your accounts
      // const senderAccount: string =
      //   'k:e793daecfeaadcda16dbe9990a7f237c6f7c79d9212a39cfe9d63d885d308704';
      // const receiverAccount: string =
      //   'k:a5c1f5297c4e30faf3b1d64268de552712108c5107e3ae34cb0400d3762262c1';

      // const from: IAccount = {
      //   account: senderAccount,
      //   chainId: '0',
      //   publicKey: senderAccount.split(':')[1],
      //   secretKey:
      //     '2bea2e5adb4e92d44b96f13232d4438852a39eb05357ce9e82ecc45b7182ab05',
      // };

      // const to: IAccount = {
      //   account: receiverAccount,
      //   secretKey: '',
      //   chainId: '1',
      //   publicKey: receiverAccount.split(':')[1],
      // };

      // doCrossChainTransfer(from, to, amount).then((result) =>
      //   console.log('success', result),
      // );
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
