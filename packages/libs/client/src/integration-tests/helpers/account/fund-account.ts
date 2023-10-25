import type { ChainId, IPactDecimal } from '@kadena/types';
import { Pact, readKeyset } from '../../../index';
import { NetworkId } from '../../support/enums';
import { sender00Account } from '../../test-data/accounts';
import { listen, preflight, submit } from '../client';
import { signByKeyPair } from '../transactions/sign-transaction';

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
        sender00Account.account,
        receiver,
        readKeyset('ks'),
        amount,
      ),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(sender00Account.publicKey, (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability(
        'coin.TRANSFER',
        sender00Account.account,
        receiver,
        amount,
      ),
    ])
    .addKeyset('ks', 'keys-all', receiverKey)
    .setMeta({
      chainId: chain,
      gasLimit: 1000,
      gasPrice: 1.0e-6,
      senderAccount: sender00Account.account,
    })
    .setNetworkId(NetworkId.fast_development)
    .createTransaction();

  const signedTx = signByKeyPair(transaction, sender00Account);

  const preflightResult = await preflight(signedTx);
  if (preflightResult.result.status === 'failure') {
    console.error(preflightResult.result.error);
    return 'Preflight failed';
  }

  const requestKey = await submit(signedTx);
  const response = await listen(requestKey);
  return response.result.status;
}
