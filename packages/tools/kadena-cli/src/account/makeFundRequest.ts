// import { ChainId, Pact } from '@kadena/client';
// import { PactNumber } from '@kadena/pactjs';

// import { submit } from '../utils/client';
// import { getConfig } from '../utils/globalConfig';

import type { TFundOptions } from './fundCommand';
// import { defaultContext, defaults } from '../constants/config';

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

async function fundTestNet({ receiver }: TFundOptions): Promise<void> {
  // const { chainId, networkId, publicKey } = getConfig();
  // const amount = 100;
  // Pact.builder
  //   .execution(
  //     Pact.modules['user.coin-faucet']['request-coin'](
  //       receiver,
  //       new PactNumber(amount).toPactDecimal(),
  //     ),
  //   )
  //   .addSigner(publicKey, (withCapability) => [
  //     withCapability('coin.GAS'),
  //     withCapability(
  //       'coin.TRANSFER',
  //       'coin-faucet',
  //       receiver,
  //       new PactNumber(amount).toPactDecimal(),
  //     ),
  //   ])
  //   .setMeta({
  //     creationTime: Math.floor(new Date().getTime() / 1000),
  //     ttl: 28800,
  //     gasLimit: 10000,
  //     chainId: chainId.toString() as ChainId,
  //     gasPrice: 0.00001,
  //     senderAccount: 'faucet-operation',
  //   })
  //   .setNetworkId(networkId)
  //   .createTransaction();
}

async function fundDevNet({ receiver }: TFundOptions): Promise<void> {
  // todo - implement
}

export async function makeFundRequest(args: TFundOptions): Promise<void> {
  const { network } = args;
  switch (network) {
    case 'testnet':
      return fundTestNet(args);
    case 'devnet':
      return fundDevNet(args);
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}
