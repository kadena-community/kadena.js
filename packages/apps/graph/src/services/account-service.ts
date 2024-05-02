import { fungibleAccountDetailsLoader } from '../graph/data-loaders/fungible-account-details';
import { nonFungibleTokenBalancesLoader } from '../graph/data-loaders/non-fungible-token-balances';
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

  if (!accountDetails || accountDetails === null) return null;

  return {
    __typename: FungibleChainAccountName,
    chainId,
    accountName,
    fungibleName,
    guard: accountDetails.guard,
    balance: accountDetails.balance,
    transactions: [],
    transfers: [],
  };
}

export async function getNonFungibleChainAccount({
  chainId,
  accountName,
}: {
  chainId: string;
  accountName: string;
}): Promise<INonFungibleChainAccount | null> {
  const tokenDetails = await nonFungibleTokenBalancesLoader.load({
    accountName,
    chainId,
  });

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
