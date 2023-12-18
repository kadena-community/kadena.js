import { createSignWithKeypair, type ChainId } from '@kadena/client';
import { createAccount } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import { expect } from '@playwright/test';
import { sender00Account } from '../fixtures/accounts.fixture';
import { devnetHost, networkId } from '../fixtures/constants';
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
export async function createAccountOnChain(chain: ChainId): Promise<IAccountWithSecretKey> {
  const generatedAccount = await generateAccount(chain);
  const creationTask = await createAccount(
    {
      account: generatedAccount.account,
      keyset: {
        pred: 'keys-all',
        keys: [generatedAccount.publicKey],
      },
      gasPayer: {
        account: sender00Account.account,
        publicKeys: [sender00Account.publicKey],
      },
      chainId: chain,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([sender00Account]),
    },
  );
  const result = await creationTask.executeTo();
  console.log(result)
  expect(result).toBe('Write succeeded');
  return generatedAccount
}
