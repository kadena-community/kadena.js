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

// TODO: we need to store the data in indexed db since we want to have a multi profile and also we need to store more data
const ENCRYPTED_MNEMONIC = 'kadena_encrypted_mnemonic';
const KEYS = 'kadena_keys';

const WalletContext = createContext<{
  createWallet: (password: string, mnemonic: string) => void;
  unlockWallet: (password: string) => void;
  createPublicKeys: (quantity?: number) => string[];
  sign: (TXs: IUnsignedCommand[]) => IUnsignedCommand[];
  publicKeys: string[];
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
  derivationPathTemplate = `m'/44'/626'/<index>'`,
}) => {
  const [encryptionKey] = useState<Uint8Array>(() => {
    const randomBytesBuffer = new Uint8Array(32);
    crypto.getRandomValues(randomBytesBuffer);
    return randomBytesBuffer;
  });

  const [publicKeys, setPublicKeys] = useLocalStorage<string[]>(KEYS, []);

  const [encryptedSeed, setEncryptedSeed] = useState<Uint8Array>();
  console.log('encryptedSeed', encryptedSeed);

  const createWallet = async (password: string, mnemonic: string) => {
    const encryptedMnemonic = kadenaEncrypt(password, mnemonic);
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
    const mnemonic = new TextDecoder().decode(
      kadenaDecrypt(password, encryptedMnemonic),
    );
    const seed = await kadenaMnemonicToSeed(encryptionKey, mnemonic, 'buffer');
    setEncryptedSeed(seed);
    const keys = JSON.parse(localStorage.getItem(KEYS) || '[]') as string[];
    setPublicKeys(keys);
  };

  const createPublicKeys = (quantity = 1) => {
    if (!encryptedSeed) {
      throw new Error('Wallet is not unlocked');
    }
    const index = publicKeys.length;
    const newPublicKeys = kadenaGetPublic(
      encryptionKey,
      encryptedSeed,
      [index, index + quantity - 1],
      derivationPathTemplate,
    );
    setPublicKeys([...publicKeys, ...newPublicKeys]);
    return newPublicKeys;
  };

  const sign = (TXs: IUnsignedCommand[]) => {
    if (!encryptedSeed) {
      throw new Error('Wallet is not unlocked');
    }
    const signedTx = TXs.map((Tx) => {
      const cmd: IPactCommand = JSON.parse(Tx.cmd);
      const releventIndexes = cmd.signers
        .map((signer) => publicKeys.indexOf(signer.pubKey))
        .filter((index) => index !== -1);
      const signatures = kadenaSignWithSeed(
        encryptionKey,
        encryptedSeed,
        releventIndexes,
        derivationPathTemplate,
      )(Tx.hash);
      return addSignatures(Tx, ...signatures);
    });

    return signedTx;
  };

  return (
    <WalletContext.Provider
      value={{
        createWallet,
        unlockWallet,
        createPublicKeys,
        publicKeys,
        sign,
        isUnlocked: Boolean(encryptedSeed),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
