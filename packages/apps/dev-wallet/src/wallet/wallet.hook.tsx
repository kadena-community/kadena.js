import { useContext } from 'react';
import { WalletContext } from './wallet.context';

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletContextProvider');
  }
  return context;
};
