import type { ChainId } from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';
import type { IAccountWithSecretKey } from '../types/accounts';

export async function generateAccount(
  chain: ChainId,
): Promise<IAccountWithSecretKey> {
  const keyPair = genKeyPair();
  return {
    account: `k:${keyPair.publicKey}`,
    publicKey: keyPair.publicKey,
    chainId: chain,
    guard: keyPair.publicKey,
    secretKey: keyPair.secretKey as string,
  };
}
