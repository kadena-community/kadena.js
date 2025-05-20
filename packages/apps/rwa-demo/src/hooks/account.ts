import type { IWalletContext } from '@/contexts/WalletContext/WalletContext';
import { WalletContext } from '@/contexts/WalletContext/WalletContext';
import { useContext } from 'react';

export const useAccount = (): IWalletContext => useContext(WalletContext);
