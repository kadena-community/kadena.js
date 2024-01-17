import { kadenaEncrypt, kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ICryptoService } from './crypto.service';

// TODO: we need to store the data in indexed db since we want to have a multi profile and also we need to store more data
export const KEY_LENGTH = 'key_length';
export const ENCRYPTED_MNEMONIC = 'kadena_encrypted_mnemonic';

const CryptoContext = createContext<
  | (Omit<ICryptoService, 'restoreWallet'> & {
      publicKeys: string[];
      loaded: boolean;
      hasEncryptedSeed: () => boolean;
      restoreWallet: (password: string) => Promise<boolean>;
      reset: () => void;
    })
  | null
>(null);

interface CryptoContextProps {
  children: React.ReactNode;
}

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoContextProvider');
  }
  return context;
};

export const CryptoContextProvider = ({ children }: CryptoContextProps) => {
  const [encryptionKey] = useState<Uint8Array>(() => {
    const randomBytesBuffer = new Uint8Array(32);
    crypto.getRandomValues(randomBytesBuffer);
    return randomBytesBuffer;
  });

  const [keyLength, setKeyLength] = useLocalStorage(KEY_LENGTH, 0);
  const [masterKey, setMasterKey] = useLocalStorage<string | null>(
    ENCRYPTED_MNEMONIC,
    '',
  );
  const [seedBuffer, setSeedBuffer] = useState<Uint8Array | null>(null);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);

  const createWallet = async (password: string, mnemonic: string[]) => {
    const encryptedMnemonic = kadenaEncrypt(password, mnemonic.join(' '));
    localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedMnemonic);
    const seedBuffer = kadenaMnemonicToSeed(encryptionKey, mnemonic);
  };

  useEffect(() => {
    if (devPassword) {
      wallet.restoreWallet(devPassword, keyLength).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <CryptoContext.Provider
      value={{
        ...wallet,
        publicKeys,
        loaded: Boolean(seedBuffer),
        hasEncryptedSeed: () => Boolean(masterKey),
        reset: () => {
          setSeedBuffer(null);
        },
        restoreWallet: async (password: string) =>
          wallet.restoreWallet(password, keyLength),
      }}
    >
      {!loading ? children : 'Loading...'}
    </CryptoContext.Provider>
  );
};
