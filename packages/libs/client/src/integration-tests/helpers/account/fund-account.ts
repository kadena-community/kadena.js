import { ChainId, IPactDecimal } from '@kadena/types';

import { Pact, readKeyset } from '../../../index';

import { listen, preflight, submit } from '../client';
import { signByKeyPair } from '../transactions/sign-transaction';

const NETWORK_ID: string = 'fast-development';
const senderAccount: string = 'sender00';
const signerKey: string =
  '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';

export async function fundAccount(
  receiver: string,
  receiverKey: string,
  amount: IPactDecimal,
  chain: ChainId,
): Promise<string | undefined> {
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
      chainId: chain,
      gasLimit: 1000,
      gasPrice: 1.0e-6,
      senderAccount: senderAccount,
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signByKeyPair(transaction);

  const preflightResult = await preflight(signedTx);
  if (preflightResult.result.status === 'failure') {
    console.error(preflightResult.result.error);
    return 'Preflight failed';
  }

  const requestKey = await submit(signedTx);
  const response = await listen(requestKey);
  return response.result.status;
}
