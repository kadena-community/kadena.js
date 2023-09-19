import type { ChainId } from '@kadena/client';
import {
  createSignWithKeypair,
  isSignedTransaction,
  Pact,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

import { FAUCET_CONSTANTS } from '../constants/faucet';
import { pollStatus, submit } from '../utils/client';

import type { TFundOptions } from './fundCommand';

// /* fund code from kadena testnet facuet

//     convert to kadenaClient code
//     {
//         "networkId": "testnet04",
//         "payload": {
//             "exec": {
//                 "data": {},
//                 "code": "(user.coin-faucet.request-coin \"k:d96869d474ccab3105b88b81d5dfa401b2da020f0a9b3fa6ce7293611dde6ebb\" 20.0)"
//             }
//         },
//         "signers": [{
//             "clist": [{
//                 "name": "coin.GAS",
//                 "args": []
//             }],
//             "pubKey": "dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e"
//         }, {
//             "clist": [{
//                 "name": "coin.TRANSFER",
//                 "args": ["coin-faucet", "k:d96869d474ccab3105b88b81d5dfa401b2da020f0a9b3fa6ce7293611dde6ebb", 20]
//             }],
//             "pubKey": "5a35ea04d614264c59f6272c90d76d45d9f735b69657067acd3e6d3a8b8cc417"
//         }],
//         "meta": {
//             "creationTime": 1694521163,
//             "ttl": 28800,
//             "gasLimit": 10000,
//             "chainId": "1",
//             "gasPrice": 0.00001,
//             "sender": "faucet-operation"
//         },
//         "nonce": "\"2023-09-12T12:19:37.742Z\""
//     }
// */

async function fundTestNet({
  receiver,
  chainId,
  networkId,
}: TFundOptions): Promise<void> {
  const { faucetOpKP, faucetAcct, faucetOpAcct } = FAUCET_CONSTANTS;
  const amount = 20;
  const transaction = Pact.builder
    .execution(
      Pact.modules['user.coin-faucet']['request-coin'](
        receiver,
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(faucetOpAcct, (withCap: any) => [withCap('coin.GAS')])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(faucetOpKP.publicKey, (withCap: any) => [
      withCap(
        'coin.TRANSFER',
        faucetAcct,
        receiver,
        new PactNumber(amount).toPactDecimal(),
      ),
    ])
    .setMeta({
      senderAccount: faucetOpAcct,
      chainId: chainId as unknown as ChainId,
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
      const response = await pollStatus(transactionDescriptor);
      console.log(response);
      const x = response[transactionDescriptor.requestKey];
      console.log(x);

      // if (response.result.status === 'failure') {
      //   throw response.result.error;
      // } else {
      //   console.log(response.result);
      // }
    }
  } catch (e) {
    throw new Error(`Failed to fund account: ${e}`);
  }
}

async function fundDevNet({ receiver }: TFundOptions): Promise<void> {
  // todo - implement
}

export async function makeFundRequest(args: TFundOptions): Promise<void> {
  const { network } = args;
  switch (network) {
    case 'testnet' as Partial<TFundOptions>['network']:
      return fundTestNet(args);
    case 'devnet' as Partial<TFundOptions>['network']:
      return fundDevNet(args);
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}
