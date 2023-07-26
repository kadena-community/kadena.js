// import { sign } from '@kadena/cryptography-utils';
// import { ICommand, IPactDecimal } from '@kadena/types';
//
// import { isSignedCommand, Pact } from '../../index';
//
// import { listen, submit } from './client';
//
// const NETWORK_ID: string = 'fast-development';
//
// export async function transfer(
//   sender: string,
//   receiver: string,
//   amount: IPactDecimal,
// ): Promise<void> {
//   const transaction = Pact.builder
//     .execution((Pact.modules as any).coin.transfer(sender, receiver, amount))
//     .addSigner(
//       '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
//       (withCapability: any) => [
//         withCapability('coin.GAS'),
//         withCapability('coin.TRANSFER', sender, receiver, amount),
//       ],
//     )
//     .setMeta({ chainId: '0', sender })
//     .setNetworkId(NETWORK_ID)
//     .createTransaction();
//
//   console.log('transaction', JSON.parse(transaction.cmd));
//
//   const { sig } = sign(transaction.cmd, {
//     secretKey:
//       '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
//     publicKey:
//       '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
//   });
//   if (sig === undefined) {
//     throw new Error('SIG_IS_UNDEFINED');
//   }
//   transaction.sigs = [{ sig }];
//   console.log('transation.sigs', JSON.stringify(transaction.sigs, null, 2));
//   const signedTr = transaction as ICommand;
//
//   if (isSignedCommand(signedTr)) {
//     const requestKey = await submit(signedTr);
//     const response = await listen(requestKey);
//     if (response.result.status === 'failure') {
//       throw response.result.error;
//     } else {
//       console.log(response.result);
//     }
//   }
// }

import { sign } from '@kadena/cryptography-utils';
import { ICommand, IPactDecimal, IUnsignedCommand } from '@kadena/types';

import {
  isSignedCommand,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '../../index';

import { listen, preflight, submit } from './client';

const NETWORK_ID: string = 'fast-development';

export async function fund(
  receiver: string,
  receiverKey: string,
  amount: IPactDecimal,
): Promise<void> {
  const senderAccount = 'sender00';
  const signerKey =
    '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';

  const transaction = Pact.builder
    .execution(
      (Pact.modules as any).coin['transfer-create'](
        senderAccount,
        receiver,
        readKeyset('ks'),
        amount,
      ),
    )
    .addSigner(signerKey, (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', senderAccount, receiver, amount),
    ])
    .addKeyset('ks', 'keys-all', receiverKey)
    .setMeta({
      chainId: '1',
      gasLimit: 1000,
      gasPrice: 1.0e-6,
      sender: senderAccount,
      ttl: 10 * 60, // 10 minutes
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signByKeyPair(transaction);
  //console.log(`signed transaction: ${signedTx.cmd}`);

  const preflightResult = await preflight(signedTx);
  console.log(preflightResult);
  if (preflightResult.result.status === 'failure') {
    console.error(preflightResult.result.status);
    throw new Error('failure');
  }

  console.log('preflight successful');

  if (isSignedCommand(signedTx)) {
    const requestKey = await submit(signedTx);
    const response = await listen(requestKey);
    console.log('result: ' + response);

    if (response.result.status === 'failure') {
      console.error(response);
      throw new Error('Transaction failed');
    }
  }

}

function signByKeyPair(transaction: IUnsignedCommand): ICommand {
  const { sig } = sign(transaction.cmd, {
    secretKey:
      '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    publicKey:
      '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  });
  if (sig === undefined) {
    throw new Error('SIG_IS_UNDEFINED');
  }
  transaction.sigs = [{ sig }];
  return transaction as ICommand;
}
