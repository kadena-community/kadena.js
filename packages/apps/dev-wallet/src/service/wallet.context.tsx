import { IPactCommand, IUnsignedCommand, addSignatures } from '@kadena/client';
import {
  EncryptedString,
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '@kadena/hd-wallet';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import { useLocalStorage } from 'usehooks-ts';

// we need to handle multiple wallets later; for now I just prefix the keys with "default_"
// it can be profile id or something when we have multiple wallets or even using indexeddb
const ENCRYPTED_MNEMONIC = 'default_kadena_encrypted_mnemonic';
const KEYS = 'default_kadena_keys';

interface KeyStore {
  derivationPathTemplate: string;
  keys: string[];
}

const WalletContext = createContext<{
  createWallet: (password: string, mnemonic: string) => Promise<void>;
  unlockWallet: (password: string) => Promise<void>;
  createPublicKeys: (quantity?: number) => Promise<string[]>;
  sign: (TXs: IUnsignedCommand[]) => Promise<IUnsignedCommand[]>;
  keyStores: KeyStore[];
  isUnlocked: boolean;
} | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a CryptoContextProvider');
  }
  return context;
};

type WalletContextProviderProps = PropsWithChildren<{
  derivationPathTemplate?: string;
}>;

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  const [encryptionKey] = useState<ArrayBuffer>(() => {
    const randomBytesBuffer = new Uint8Array(32);
    crypto.getRandomValues(randomBytesBuffer);
    return randomBytesBuffer.buffer;
  });

  const [keyStores, setKeyStores] = useLocalStorage<KeyStore[]>(KEYS, []);

  const [encryptedSeed, setEncryptedSeed] = useState<ArrayBuffer>();
  console.log('encryptedSeed', encryptedSeed);

  const createWallet = async (password: string, mnemonic: string) => {
    const encryptedMnemonic = await kadenaEncrypt(password, mnemonic);
    localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedMnemonic);
    const seed = await kadenaMnemonicToSeed(encryptionKey, mnemonic, 'buffer');
    setEncryptedSeed(seed);
  };

  const unlockWallet = async (password: string) => {
    const encryptedMnemonic = localStorage.getItem(
      ENCRYPTED_MNEMONIC,
    ) as EncryptedString | null;
    if (!encryptedMnemonic) {
      throw new Error('No wallet found');
    }
    const decryptedMnemonicBuffer = await kadenaDecrypt(
      password,
      encryptedMnemonic,
    );
    const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
    const seed = await kadenaMnemonicToSeed(encryptionKey, mnemonic, 'buffer');
    setEncryptedSeed(seed);
    const keys = JSON.parse(localStorage.getItem(KEYS) || '[]') as KeyStore[];
    setKeyStores(keys);
  };

  const createPublicKeys = async (
    quantity = 1,
    derivationPathTemplate = `m'/44'/626'/<index>'`,
  ) => {
    if (!encryptedSeed) {
      throw new Error('Wallet is not unlocked');
    }
    const keyStore = keyStores.findIndex(
      (store) => store.derivationPathTemplate === derivationPathTemplate,
    );
    const index = keyStore === -1 ? 0 : keyStores[keyStore].keys.length;
    const newPublicKeys = await kadenaGetPublic(
      encryptionKey,
      encryptedSeed,
      [index, index + quantity - 1],
      derivationPathTemplate,
    );
    if (keyStore === -1) {
      setKeyStores([
        ...keyStores,
        { derivationPathTemplate, keys: newPublicKeys },
      ]);
      return newPublicKeys;
    }
    keyStores[keyStore].keys = [...keyStores[keyStore].keys, ...newPublicKeys];
    setKeyStores([...keyStores]);
    return newPublicKeys;
  };

  const sign = (TXs: IUnsignedCommand[]) => {
    if (!encryptedSeed) {
      throw new Error('Wallet is not unlocked');
    }
    const signedTx = Promise.all(
      TXs.map(async (Tx) => {
        const signatures = await Promise.all(
          keyStores.map(async ({ keys, derivationPathTemplate }) => {
            const cmd: IPactCommand = JSON.parse(Tx.cmd);
            const relevantIndexes = cmd.signers
              .map((signer) => keys.indexOf(signer.pubKey))
              .filter((index) => index !== -1);
            const signatures = await kadenaSignWithSeed(
              encryptionKey,
              encryptedSeed,
              relevantIndexes,
              derivationPathTemplate,
            )(Tx.hash);
            return signatures;
          }),
        );
        return addSignatures(Tx, ...signatures.flat());
      }),
    );

    return signedTx;
  };

  return (
    <WalletContext.Provider
      value={{
        createWallet,
        unlockWallet,
        createPublicKeys,
        keyStores,
        sign,
        isUnlocked: Boolean(encryptedSeed),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
