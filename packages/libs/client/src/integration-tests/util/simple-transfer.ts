import { sign } from '@kadena/cryptography-utils';
import { ICommand, IPactDecimal, IUnsignedCommand } from '@kadena/types';

import { isSignedTransaction, Pact, readKeyset } from '../../index';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Pact.modules as any).coin['transfer-create'](
        senderAccount,
        receiver,
        readKeyset('ks'),
        amount,
      ),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(signerKey, (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', senderAccount, receiver, amount),
    ])
    .addKeyset('ks', 'keys-all', receiverKey)
    .setMeta({
      chainId: '1',
      gasLimit: 1000,
      gasPrice: 1.0e-6,
      senderAccount: senderAccount,
      //ttl: 10 * 60, // 10 minutes
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signByKeyPair(transaction);

  const preflightResult = await preflight(signedTx);
  if (preflightResult.result.status === 'failure') {
    console.error(preflightResult.result.status);
    throw new Error('failure');
  }

  if (isSignedTransaction(signedTx)) {
    const requestKey = await submit(signedTx);
    const response = await listen(requestKey);

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
