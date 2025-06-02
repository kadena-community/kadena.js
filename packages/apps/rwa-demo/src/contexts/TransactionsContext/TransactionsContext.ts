import type { ICommandResult } from '@kadena/client';
import { createContext } from 'react';

export interface ITxType {
  name: keyof typeof TXTYPES;
  overall?: boolean;
}

export const TXTYPES: Record<
  | 'SETCOMPLIANCE'
  | 'SETCOMPLIANCERULE'
  | 'ADDINVESTOR'
  | 'DELETEINVESTOR'
  | 'ADDAGENT'
  | 'REMOVEAGENT'
  | 'CREATECONTRACT'
  | 'FREEZEINVESTOR'
  | 'DISTRIBUTETOKENS'
  | 'PARTIALLYFREEZETOKENS'
  | 'TRANSFERTOKENS'
  | 'FAUCET'
  | 'PAUSECONTRACT',
  ITxType
> = {
  SETCOMPLIANCE: { name: 'SETCOMPLIANCE', overall: true },
  SETCOMPLIANCERULE: { name: 'SETCOMPLIANCERULE', overall: true },
  ADDINVESTOR: { name: 'ADDINVESTOR', overall: true },
  DELETEINVESTOR: { name: 'DELETEINVESTOR', overall: true },
  ADDAGENT: { name: 'ADDAGENT', overall: true },
  REMOVEAGENT: { name: 'REMOVEAGENT', overall: true },
  PAUSECONTRACT: { name: 'PAUSECONTRACT', overall: true },
  FREEZEINVESTOR: { name: 'FREEZEINVESTOR', overall: true },
  CREATECONTRACT: { name: 'CREATECONTRACT', overall: true },
  DISTRIBUTETOKENS: { name: 'DISTRIBUTETOKENS', overall: true },
  PARTIALLYFREEZETOKENS: { name: 'PARTIALLYFREEZETOKENS', overall: true },
  TRANSFERTOKENS: { name: 'TRANSFERTOKENS', overall: true },
  FAUCET: { name: 'FAUCET', overall: false },
} as const;

export interface ITransaction {
  uuid: string;
  requestKey: string;
  type: ITxType;
  chainId?: string;
  networkId?: string;
  listener?: any;
  accounts: string[];
  result?: ICommandResult['result'];
}

export interface ITransactionsContext {
  transactions: ITransaction[];
  addTransaction: (
    request: Omit<ITransaction, 'uuid'>,
  ) => Promise<ITransaction>;
  getTransactions: (type: ITxType | ITxType[]) => ITransaction[];
  txsButtonRef?: HTMLButtonElement | null;
  setTxsButtonRef: (value: HTMLButtonElement) => void;
  txsAnimationRef?: HTMLDivElement | null;
  setTxsAnimationRef: (value: HTMLDivElement) => void;
  isActiveAccountChangeTx: boolean; //checks if the agentroles for this user are being changed. if so, stop all permissions until the tx is resolved
}

export const TransactionsContext = createContext<ITransactionsContext | null>(
  null,
);
