import { useCallback } from 'react';
import { KeySourceWithSecret } from '../interface';
import { IKeySourceManager } from '../keySourceService';

interface HDWalletContext {
  keySourceManager: IKeySourceManager;
}

export const useHDWallet = () => {
  const createHDWallet = useCallback(
    async (
      context: HDWalletContext,
      type: 'hd-wallet-slip10' | 'hd-wallet-chainweaver',
      password: string,
      mnemonic: string,
      derivationPathTemplate?: string,
    ) => {
      const { keySourceManager } = context;
      if (!keySourceManager) {
        throw new Error('Wallet not initialized');
      }
      if (type === 'hd-wallet-chainweaver') {
        if (derivationPathTemplate) {
          throw new Error('Chainweaver does not support derivation path');
        }
        throw new Error('Chainweaver not supported yet');
      }
      const keySource = await keySourceManager
        .get(type)
        .register(mnemonic, password, derivationPathTemplate);

      return keySource;
    },
    [],
  );

  const unlockHDWallet = useCallback(
    async (
      context: HDWalletContext,
      type: 'hd-wallet-slip10' | 'hd-wallet-chainweaver',
      password: string,
      keySource: KeySourceWithSecret,
    ) => {
      const { keySourceManager } = context;
      if (type === 'hd-wallet-chainweaver') {
        throw new Error('Chainweaver not supported yet');
      }
      if (!keySourceManager) {
        throw new Error('Key source manager not initialized');
      }
      await keySourceManager.get(type).connect(password, keySource);
    },
    [],
  );

  return {
    createHDWallet,
    unlockHDWallet,
  };
};
