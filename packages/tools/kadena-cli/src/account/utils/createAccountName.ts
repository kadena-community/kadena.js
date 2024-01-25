import { createPrincipal } from '@kadena/client-utils/built-in';
import type { IAddAccountManualConfig } from '../types.js';

export async function createAccountName(
  config: IAddAccountManualConfig,
): Promise<string> {
  const publicKeys = config.publicKeysConfig.filter((key: string) => !!key);

  if (publicKeys.length === 0) {
    throw new Error(
      'No public keys provided to create an account and get the account details.',
    );
  }

  try {
    const accountName = await createPrincipal(
      {
        keyset: {
          pred: config.predicate,
          keys: publicKeys,
        },
      },
      {
        host: config.networkConfig.networkHost,
        defaults: {
          networkId: config.networkConfig.networkId,
          meta: {
            chainId: config.chainId,
          },
        },
      },
    );
    return accountName;
  } catch (e) {
    throw new Error('There was an error creating the account.');
  }
}
