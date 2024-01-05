import { accountDetailsLoader } from '../graph/data-loaders/account-details';
import { tokenDetailsLoader } from '../graph/data-loaders/token-details';
import type {
  FungibleChainAccount,
  NonFungibleChainAccount,
} from '../graph/types/graphql-types';
import {
  FungibleChainAccountName,
  NonFungibleChainAccountName,
} from '../graph/types/graphql-types';

export async function getFungibleChainAccount({
  chainId,
  fungibleName,
  accountName,
}: {
  chainId: string;
  fungibleName: string;
  accountName: string;
}): Promise<FungibleChainAccount | null> {
  const accountDetails = await accountDetailsLoader.load({
    fungibleName,
    accountName,
    chainId,
  });

  return accountDetails !== null
    ? {
        __typename: FungibleChainAccountName,
        chainId,
        accountName,
        fungibleName,
        guard: {
          keys: accountDetails.guard.keys,
          predicate: accountDetails.guard.pred,
        },
        balance: accountDetails.balance,
        transactions: [],
        transfers: [],
      }
    : null;
}

export async function getNonFungibleChainAccount({
  chainId,
  accountName,
}: {
  chainId: string;
  accountName: string;
}): Promise<NonFungibleChainAccount | null> {
  const [accountDetails, tokenDetails] = await Promise.all([
    accountDetailsLoader.load({ accountName, chainId, fungibleName: 'coin' }),
    tokenDetailsLoader.load({ accountName, chainId }),
  ]);

  return accountDetails !== null && tokenDetails !== null
    ? {
        __typename: NonFungibleChainAccountName,
        chainId,
        accountName,
        guard: {
          keys: accountDetails.guard.keys,
          predicate: accountDetails.guard.pred,
        },
        nonFungibles: tokenDetails,
        transactions: [],
      }
    : null;
}
