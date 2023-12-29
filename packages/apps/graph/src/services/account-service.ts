import { accountDetailsLoader } from '../graph/data-loaders/account-details';
import { tokenDetailsLoader } from '../graph/data-loaders/token-details';
import type {
  ChainFungibleAccount,
  ChainNonFungibleAccount,
} from '../graph/types/graphql-types';
import {
  ChainFungibleAccountName,
  ChainNonFungibleAccountName,
} from '../graph/types/graphql-types';

export async function getChainFungibleAccount({
  chainId,
  fungibleName,
  accountName,
}: {
  chainId: string;
  fungibleName: string;
  accountName: string;
}): Promise<ChainFungibleAccount | null> {
  const accountDetails = await accountDetailsLoader.load({
    fungibleName,
    accountName,
    chainId,
  });

  return accountDetails !== null
    ? {
        __typename: ChainFungibleAccountName,
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

export async function getChainNonFungibleAccount({
  chainId,
  accountName,
}: {
  chainId: string;
  accountName: string;
}): Promise<ChainNonFungibleAccount | null> {
  const accountDetails = await accountDetailsLoader.load({
    accountName,
    chainId,
    fungibleName: 'coin',
  });

  const tokenDetails = await tokenDetailsLoader.load({
    accountName,
    chainId,
  });

  return accountDetails !== null && tokenDetails !== null
    ? {
        __typename: ChainNonFungibleAccountName,
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
