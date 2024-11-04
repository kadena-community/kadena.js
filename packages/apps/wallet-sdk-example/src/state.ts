import type { ChainId } from '@kadena/client';
import { ITransactionDescriptor } from '@kadena/wallet-sdk';
import { atomWithStorage } from 'jotai/utils';

export interface PendingTransfer {
  from: string;
  to: string;
  amount: string;
  chain: ChainId;
  requestKey: string;
  descriptor: ITransactionDescriptor;
}

export const pendingTransfersAtom = atomWithStorage(
  'pending_transfers',
  [] as PendingTransfer[],
);
export const mnemonicWordsAtom = atomWithStorage('mnemonic_words', '');
export const selectedAccountAtom = atomWithStorage('selected_account', '');
export const selectedNetworkAtom = atomWithStorage('network_id', 'testnet04');
export const selectedFungibleAtom = atomWithStorage(
  'selected_fungible',
  'coin',
);
