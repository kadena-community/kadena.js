import React from 'react';
import { WalletConnectContext } from '../walletconnect.provider';

export const useWalletConnect = () => {
  return React.useContext(WalletConnectContext)!;
};
