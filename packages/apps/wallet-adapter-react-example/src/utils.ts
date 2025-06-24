import type { ChainId } from '@kadena/client';
import { Pact, createTransaction } from '@kadena/client';
import type {
  IAccountInfo,
  ISigningRequestPartial,
} from '@kadena/wallet-adapter-core';

export function createExampleTransaction(
  fromAccountName: string,
  fromAccountPublicKey: string,
  toAccount: string,
  chainId: ChainId,
  networkId: string,
) {
  const amount = '0.1';

  const command = Pact.builder
    .execution(
      (Pact as any).modules.coin.transfer(fromAccountName, toAccount, amount),
    )
    .addSigner([fromAccountPublicKey], (withCap: any) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', fromAccountName, toAccount, amount),
    ])
    .setMeta({
      gasLimit: 1500,
      chainId,
      senderAccount: fromAccountName,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(networkId)
    .getCommand();

  return createTransaction(command);
}

export function createExampleCommand(
  fromAccountName: string,
  fromAccountPublicKey: string,
  toAccount: string,
  chainId: ChainId,
  networkId: string,
) {
  const amount = '0.1';

  const command = Pact.builder
    .execution(
      (Pact as any).modules.coin.transfer(fromAccountName, toAccount, amount),
    )
    .addSigner([fromAccountPublicKey], (withCap: any) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', fromAccountName, toAccount, amount),
    ])
    .setMeta({
      gasLimit: 1500,
      chainId,
      senderAccount: fromAccountName,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(networkId)
    .getCommand();

  return command;
}

export function createExampleSignRequest() {
  const request: ISigningRequestPartial = {} as any;
  return request;
}

export const autoSelectPublicKey = (account: IAccountInfo) => {
  return account.keyset.keys.sort((a, b) => {
    // prioritize keys starting with WEBAUTHN-
    if (a.startsWith('WEBAUTHN-') && !b.startsWith('WEBAUTHN-')) return -1;
    if (!a.startsWith('WEBAUTHN-') && b.startsWith('WEBAUTHN-')) return 1;
    // otherwise it doesn't matter
    return 0;
  })[0];
};
