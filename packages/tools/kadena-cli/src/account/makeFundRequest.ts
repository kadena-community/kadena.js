import type { ChainId } from '@kadena/client';
import {
  createSignWithKeypair,
  isSignedTransaction,
  Pact,
} from '@kadena/client';
import type { IPactDecimal } from '@kadena/types';

import { FAUCET_CONSTANTS } from '../constants/faucet.js';
import { accountExists } from '../utils/chainHelpers.js';
import { pollStatus, submit } from '../utils/client.js';

import type { TFundQuestions } from './fundQuestions.js';

import chalk from 'chalk';
import clear from 'clear';
import { stdout } from 'process';

async function fundTestNet({
  receiver,
  chainId,
  networkId,
}: TFundQuestions): Promise<void> {
  const { faucetOpKP, faucetAcct, faucetOpAcct } = FAUCET_CONSTANTS;
  const amount = {
    decimal: '20.0',
  } as IPactDecimal;
  if (await accountExists(receiver, chainId.toString() as ChainId, networkId)) {
    console.log('not implemented');
    /*

    [{
   "hash": "Y50WGUPcoKArTWlWyjGDB_qGLDDngAl0yB3Oq9CZ0pE",
   "sigs": [{
         "sig": "7b648de73e8850b0e047121b7758142fa2b02db969dfc818cdce0a433b45afb2a062a2464e1d785e537ff03f6849f42b8774ea19961e3b6ac7c52f4e45354009"
      },
      {
         "sig": "46f2510c8dcedfbc6dc50d1d8efec7c20d3418e9a22cea28fd6f6d1e08774b4903880b5f8a71401e94c9f609f41913f225c35930b3489bc3308a7bfee3997407"
      }
   ],
   "cmd": "{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{\"fund-keyset\":{\"pred\":\"keys-all\",\"keys\":[\"cd61b5ca94717bd5f18c08e66b382d37542597190b1df3b63f883126bf4d13c6\"]}},\"code\":\"(user.coin-faucet.create-and-request-coin \\\"k: cd61b5ca94717bd5f18c08e66b382d37542597190b1df3b63f883126bf4d13c6\\\" (read-keyset 'fund-keyset) 20.0)\"}},\"signers\":[{\"clist\":[{\"name\":\"coin.GAS\",\"args\":[]}],\"pubKey\":\"dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e\"},{\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"coin-faucet\",\"k: cd61b5ca94717bd5f18c08e66b382d37542597190b1df3b63f883126bf4d13c6\",20]}],\"pubKey\":\"f3af819e58d2c85a91c5ac0dadfb89e931670f49f384a10e5c33c7c776b7caea\"}],\"meta\":{\"creationTime\":1695132604,\"ttl\":28800,\"gasLimit\":10000,\"chainId\":\"1\",\"gasPrice\":0.00001,\"sender\":\"faucet-operation\"},\"nonce\":\"\\\"2023-09-19T14:10:18.898Z\\\"\"}"
}]
*/
  }

  const transaction = Pact.builder
    .execution(
      Pact.modules['user.coin-faucet']['request-coin'](receiver, amount),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(faucetOpKP.publicKey, (withCap: any) => [withCap('coin.GAS')])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(faucetOpKP.publicKey, (withCap: any) => [
      withCap('coin.TRANSFER', faucetAcct, receiver, amount),
    ])
    .setMeta({
      senderAccount: faucetOpAcct,
      chainId: chainId.toString() as ChainId,
    })
    .setNetworkId(networkId)
    .createTransaction();

  const signedTx = await createSignWithKeypair({
    publicKey: faucetOpKP.publicKey,
    secretKey: faucetOpKP.secretKey,
  })(transaction);

  try {
    if (isSignedTransaction(signedTx)) {
      const transactionDescriptor = await submit(signedTx);
      clear();
      console.log(
        chalk.green(
          `Submitted transaction - ${transactionDescriptor.requestKey}`,
        ),
      );
      stdout.write(
        chalk.yellow(
          `Processing transaction ${transactionDescriptor.requestKey}`,
        ),
      );
      await pollStatus(transactionDescriptor, {
        onPoll() {
          stdout.write(chalk.yellow(`.`));
        },
      });

      console.log(
        chalk.green(
          `Funding of wallet ${receiver} with txId: ${transactionDescriptor.requestKey} succesful`,
        ),
      );
    } else {
      clear();
      console.log(chalk.yellow(`unsigned - ${signedTx}`));
      throw new Error('Failed to sign transaction');
    }
  } catch (e) {
    clear();
    console.error(chalk.red(`Failed to fund account: ${e}`));
    throw new Error(`Failed to fund account: ${e}`);
  }
}

async function fundDevNet({ receiver }: TFundQuestions): Promise<void> {
  // todo - implement
}

export async function makeFundRequest(args: TFundQuestions): Promise<void> {
  const { network } = args;
  switch (network) {
    case 'testnet' as Partial<TFundQuestions>['network']:
      return fundTestNet(args);
    case 'devnet' as Partial<TFundQuestions>['network']:
      return fundDevNet(args);
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}
