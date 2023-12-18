import { Command, Option } from 'commander';

import 'module-alias/register';

import {
  createToken,
  createToken1,
} from '@devnet/marmalade/token/create-token';
import { createTokenId } from '@devnet/marmalade/token/create-token-id';
import { ChainId } from '@kadena/types';
import type { IAccount } from '../helper';
import { generateAccount, logger, sender00 } from '../helper';
import { deployMarmaladeContracts } from '../marmalade/deploy';
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
      await deployMarmaladeContracts(sender00);
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
      // const tokenId = await createToken({
      //   uri: `https://www.${Date.now()}.io`,
      // });

      const sender: IAccount = {
        keys: [
          {
            publicKey:
              'ac76beb00875b5618744b3f734802a51eeadb4aa2f40c9e6cf410507a69831ff',
            secretKey:
              'f401a6eb1ed1bd95c902fa4bf0dfcd9a604a3b69e6aaa5b399db8e5f8591ff24',
          },
        ],
        account:
          'k:ac76beb00875b5618744b3f734802a51eeadb4aa2f40c9e6cf410507a69831ff',
        chainId: '0' as ChainId,
      };

      const uri = `https://www.${Date.now()}.io`;
      // const tokenId = await createTokenId({
      //   sender: sender,
      //   uri: `https://www.${Date.now()}.io`,
      //   policies: [],
      //   precision: 0,
      // });

      const result = await createToken({ uri, sender });

      console.log(result);
      // await mintToken1({
      //   // tokenId: 't:dEsk5ofm2nRDjURTHrM7ao4__QsVL1huhtxSioo1KcI',
      //   tokenId: 't:bvygitdVSfiGXsrbosKxKff2ZpnzqLAN1qY5AGQQjaw',
      // });
      // await transferToken({
      //   tokenId: 't:bvygitdVSfiGXsrbosKxKff2ZpnzqLAN1qY5AGQQjaw',
      // });
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
