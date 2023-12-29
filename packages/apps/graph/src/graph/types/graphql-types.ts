import type { Transaction, Transfer } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Guard {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
}

export interface Token {
  id: string;
  balance: number;
}

export const ChainFungibleAccountName: 'ChainFungibleAccount' =
  'ChainFungibleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ChainFungibleAccount {
  __typename: typeof ChainFungibleAccountName;
  chainId: string;
  fungibleName: string;
  accountName: string;
  guard: Guard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export const FungibleAccountName: 'FungibleAccount' = 'FungibleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface FungibleAccount {
  __typename: typeof FungibleAccountName;
  fungibleName: string;
  accountName: string;
  chainAccounts: ChainFungibleAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface GraphConfiguration {
  maximumConfirmationDepth: number;
  minimumBlockHeight: bigint;
}

export const ChainNonFungibleAccountName: 'ChainNonFungibleAccount' =
  'ChainNonFungibleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ChainNonFungibleAccount {
  __typename: typeof ChainNonFungibleAccountName;
  chainId: string;
  accountName: string;
  guard: Guard;
  nonFungibles: Token[];
  transactions: Transaction[];
}

export const NonFungibleAccountName: 'NonFungibleAccount' =
  'NonFungibleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface NonFungibleAccount {
  __typename: typeof NonFungibleAccountName;
  accountName: string;
  chainAccounts: ChainNonFungibleAccount[];
  transactions: Transaction[];
}
