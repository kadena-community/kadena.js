import type { Transaction, Transfer } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Guard {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ChainModuleAccount {
  chainId: string;
  moduleName: string;
  accountName: string;
  guard: Guard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ModuleAccount {
  id: string;
  moduleName: string;
  accountName: string;
  chainAccounts: ChainModuleAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}
