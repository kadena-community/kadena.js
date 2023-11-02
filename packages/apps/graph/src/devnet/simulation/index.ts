import { Command, Option } from 'commander';
import { generateKeyPair, logger } from '../helper';
import { dummyTransaction, transfer } from '../transfer';
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
      let publicKey = args.key;
      if (publicKey === undefined) {
        const account = generateKeyPair();
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
      // const cmd =
      //   '{"payload":{"exec":{"code":"(coin.transfer-create \\"sender00\\" \\"k:e0d04c94e58d72eb11979e9bc68d664135d851feb95c64466b56effc9425bd5e\\" (read-keyset \\"ks\\") 166666.66666666666)","data":{"ks":{"keys":["e0d04c94e58d72eb11979e9bc68d664135d851feb95c64466b56effc9425bd5e"],"pred":"keys-all"}}}},"nonce":"kjs:nonce:1698921620372","signers":[{"pubKey":"368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca","scheme":"ED25519","clist":[{"name":"coin.GAS","args":[]},{"name":"coin.TRANSFER","args":["sender00","k:e0d04c94e58d72eb11979e9bc68d664135d851feb95c64466b56effc9425bd5e",{"decimal":"166666.66666666666"}]}]}],"meta":{"gasLimit":100000,"gasPrice":1e-8,"sender":"sender00","ttl":28800,"creationTime":1698921620,"chainId":"0"},"networkId":"fast-development"}';
      // const hash = 'FN_iuqEYUZNk_CacF1zjs3LuKUblIrkCjg1p-iyv2DM';
      // const parsedInput = JSON.parse(json);
      // await dummyTransaction(cmd, hash);
      await simulate(args);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
