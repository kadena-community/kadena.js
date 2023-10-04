import type { Transaction, Transfer } from "@prisma/client";

export type Guard = {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
};

export type ChainModuleAccount = {
  chainId: string;
  moduleName: string;
  accountName: string;
  guard: Guard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export type ModuleAccount = {
  id: string;
  moduleName: string;
  accountName: string;
  chainAccounts: ChainModuleAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}