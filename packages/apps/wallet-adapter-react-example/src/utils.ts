import type { ChainId } from '@kadena/client';
import { Pact, createTransaction } from '@kadena/client';

export function createExampleTransaction(
  fromAccount: string,
  toAccount: string,
  chainId: ChainId,
  networkId: string,
) {
  const fromPublicKey = fromAccount.replace('k:', '');
  const amount = '0.1';

  const command = Pact.builder
    .execution(
      (Pact as any).modules.coin.transfer(fromAccount, toAccount, amount),
    )
    .addSigner([fromPublicKey], (withCap: any) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', fromAccount, toAccount, amount),
    ])
    .setMeta({
      gasLimit: 1500,
      chainId,
      senderAccount: fromAccount,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(networkId)
    .getCommand();

  return createTransaction(command);
}
