import type { BuiltInPredicate, ChainId, ISigner } from '@kadena/client';
import { createPrincipal as createPrincipalUtil } from '@kadena/client-utils/built-in';

export function parseAccountNameAndKeys(
  accountName: string | { account: string; publicKeys: ISigner[] },
): { account: string; publicKeys: ISigner[] } {
  if (typeof accountName === 'string') {
    if (accountName.startsWith('k:')) {
      return {
        account: accountName,
        publicKeys: [accountName.substring(2)],
      };
    }
    throw new Error(`Invalid account name: ${accountName}`);
  } else {
    return accountName;
  }
}

export function parseAccountGuard(
  accountName:
    | string
    | {
        account: string;
        keyset: {
          keys: ISigner[];
          pred: 'keys-all' | 'keys-2' | 'keys-any';
        };
      },
): {
  account: string;
  keyset: {
    keys: ISigner[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
} {
  if (typeof accountName === 'string') {
    if (accountName.startsWith('k:')) {
      return {
        account: accountName,
        keyset: {
          keys: [accountName.substring(2)],
          pred: 'keys-all',
        },
      };
    }
    throw new Error(`Invalid account name: ${accountName}`);
  } else {
    return accountName;
  }
}

export async function createPrincipal({
  predicate,
  publicKeys,
  chainId,
  networkHost,
  networkId,
}: {
  predicate: string;
  publicKeys: string[];
  chainId: ChainId;
  networkHost: string;
  networkId: string;
}) {
  const accountName = await createPrincipalUtil(
    {
      keyset: {
        pred: predicate as BuiltInPredicate,
        keys: publicKeys,
      },
    },
    {
      host: networkHost,
      defaults: {
        networkId: networkId,
        meta: {
          chainId: chainId,
        },
      },
    },
  );
  return accountName;
}
