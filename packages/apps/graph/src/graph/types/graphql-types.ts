import type { Transaction, Transfer } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Guard {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
}

export const ChainModuleAccountName: 'ChainModuleAccount' =
  'ChainModuleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ChainModuleAccount {
  __typename: typeof ChainModuleAccountName;
  chainId: string;
  moduleName: string;
  accountName: string;
  guard: Guard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export const ModuleAccountName: 'ModuleAccount' = 'ModuleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ModuleAccount {
  __typename: typeof ModuleAccountName;
  moduleName: string;
  accountName: string;
  chainAccounts: ChainModuleAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface GraphConfiguration {
  maximumConfirmationDepth: number;
  minimumBlockHeight: bigint;
}
