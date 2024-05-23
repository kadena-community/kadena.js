import { createPrincipal } from '@kadena/client-utils/built-in';
import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { Predicate } from '../types.js';

export interface ICreateAccountNameConfig {
  predicate: string;
  chainId: ChainId;
  networkConfig: INetworkCreateOptions;
  publicKeys: string[];
}

export async function createAccountName({
  publicKeys,
  chainId,
  predicate,
  networkConfig,
}: ICreateAccountNameConfig): Promise<string> {
  if (publicKeys?.length === 0) {
    throw new Error('No public keys provided to create an account.');
  }

  try {
    const accountName = await createPrincipal(
      {
        keyset: {
          pred: predicate as Predicate,
          keys: publicKeys,
        },
      },
      {
        host: networkConfig.networkHost,
        defaults: {
          networkId: networkConfig.networkId,
          meta: {
            chainId: chainId,
          },
        },
      },
    );
    return accountName;
  } catch (e) {
    throw new Error(
      `There was an error creating the account name: ${e.message}`,
    );
  }
}
