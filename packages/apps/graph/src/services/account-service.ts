import { fungibleAccountDetailsLoader } from '../graph/data-loaders/fungible-account-details';
import { tokenDetailsLoader } from '../graph/data-loaders/token-details';
import type {
  IFungibleChainAccount,
  INonFungibleChainAccount,
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
}): Promise<IFungibleChainAccount | null> {
  const accountDetails = await fungibleAccountDetailsLoader.load({
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
}): Promise<INonFungibleChainAccount | null> {
  const tokenDetails = await tokenDetailsLoader.load({ accountName, chainId });

  return tokenDetails !== null && tokenDetails.length !== 0
    ? {
        __typename: NonFungibleChainAccountName,
        chainId,
        accountName,
        nonFungibleTokenBalances: tokenDetails,
        transactions: [],
      }
    : null;
}
