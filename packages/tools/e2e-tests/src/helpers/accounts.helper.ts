import type { ChainId } from '@kadena/client';
import type {
  IAccountWithSecretKey,
} from '../types/accounts';
import { genKeyPair } from '@kadena/cryptography-utils';



export async function generateAccount(
  chain: ChainId,
): Promise<IAccountWithSecretKey> {
  const keyPair =   genKeyPair();
  return {
    account: `k:${keyPair.publicKey}`,
    publicKey: keyPair.publicKey,
    chainId: chain,
    guard: keyPair.publicKey,
    secretKey: keyPair.secretKey as string,
  };
}
