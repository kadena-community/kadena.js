import { fungibleAccountDetailsLoader } from '../graph/data-loaders/fungible-account-details';
import { nonFungibleAccountDetailsLoader } from '../graph/data-loaders/non-fungible-account-details';
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
}): Promise<NonFungibleChainAccount | null> {
  const tokenDetails = await tokenDetailsLoader.load({ accountName, chainId });

  const accountDetails = await nonFungibleAccountDetailsLoader.load({
    tokenId: tokenDetails[0].id,
    accountName,
    chainId,
  });

  return tokenDetails !== null && tokenDetails.length !== 0
    ? {
        __typename: NonFungibleChainAccountName,
        chainId,
        accountName,
        guard: accountDetails.guard,
        nonFungibleTokenBalances: tokenDetails,
        transactions: [],
      }
    : null;
}
