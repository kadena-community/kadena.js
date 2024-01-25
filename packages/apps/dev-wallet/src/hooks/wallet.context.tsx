import { IPactCommand, IUnsignedCommand, addSignatures } from '@kadena/client';
import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
  randomBytes,
} from '@kadena/hd-wallet';
import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import {
  IProfile,
  KeyStore,
  WalletRepository,
  createWalletRepository,
} from './wallet.repository';

export const WalletContext = createContext<{
  createWallet: (
    profile: string,
    password: string,
    mnemonic: string,
  ) => Promise<void>;
  unlockWallet: (profile: string, password: string) => Promise<void>;
  createPublicKeys: (quantity?: number) => Promise<string[]>;
  sign: (TXs: IUnsignedCommand[]) => Promise<IUnsignedCommand[]>;
  keyStores: KeyStore[];
  isUnlocked: boolean;
  decryptMnemonic: (password: string) => Promise<string>;
  lockWallet: () => void;
  profile: Omit<IProfile, 'seedKey'> | undefined;
  profileList: Omit<IProfile, 'seedKey' | 'networks'>[];
} | null>(null);

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeProfile, setActiveProfile] = useState<IProfile>();
  const [profileList, setProfileList] = useState<IProfile[]>([]);

  const [encryptionKey] = useState<Uint8Array>(() => randomBytes(16));
  const [walletRepository, setWalletRepository] = useState<WalletRepository>();

  const [keyStores, setKeyStores] = useState<KeyStore[]>([]);

  const [encryptedSeed, setEncryptedSeed] = useState<Uint8Array>();

  useEffect(() => {
    const storePromise = createWalletRepository()
      .then(async (repository) => {
        setWalletRepository(repository);
        const profiles = await repository.getAllProfiles();
        setProfileList(profiles ?? []);
        return repository;
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      storePromise.then((store) => store?.disconnect());
    };
  }, []);

  const createWallet = async (
    profileName: string,
    password: string,
    mnemonic: string,
  ) => {
    if (!walletRepository) {
      throw new Error('Wallet repository not initialized');
    }
    const mnemonicKey = crypto.randomUUID();
    const encryptedMnemonic = await kadenaEncrypt(password, mnemonic, 'buffer');
    await walletRepository.addEncryptedValue(mnemonicKey, encryptedMnemonic);

    const profile: IProfile = {
      uuid: crypto.randomUUID(),
      name: profileName,
      networks: [],
      seedKey: mnemonicKey,
    };

    await walletRepository.addProfile(profile);
    setProfileList([...profileList, profile]);
    const seed = await kadenaMnemonicToSeed(encryptionKey, mnemonic, 'buffer');
    setEncryptedSeed(seed);
    setActiveProfile(profile);
  };

  const unlockWallet = async (profileId: string, password: string) => {
    if (!walletRepository) {
      throw new Error('Wallet repository not initialized');
    }
    const profile = await walletRepository.getProfile(profileId);
    const encryptedMnemonic = await walletRepository.getEncryptedValue(
      profile.seedKey,
    );
    const decryptedMnemonicBuffer = await kadenaDecrypt(
      password,
      encryptedMnemonic,
    );
    const profileKeyStores =
      await walletRepository.getKeyStoresByProfileId(profileId);
    const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
    const seed = await kadenaMnemonicToSeed(encryptionKey, mnemonic, 'buffer');
    setEncryptedSeed(seed);
    setActiveProfile(profile);
    setKeyStores(profileKeyStores);
  };

  const createPublicKeys = async (
    quantity = 1,
    derivationPathTemplate = `m'/44'/626'/<index>'`,
  ) => {
    if (!encryptedSeed || !activeProfile || !walletRepository) {
      throw new Error('Wallet is not unlocked');
    }
    let keyStore = keyStores.find(
      (store) => store.derivationPathTemplate === derivationPathTemplate,
    );

    if (!keyStore) {
      keyStore = {
        uuid: crypto.randomUUID(),
        source: 'hd-wallet',
        derivationPathTemplate,
        publicKeys: [],
        profileId: activeProfile.uuid,
      };
      await walletRepository.addKeyStore(keyStore);
      keyStores.push(keyStore);
    }

    const keyIndex = keyStore === undefined ? 0 : keyStore.publicKeys.length;

    const newPublicKeys = await kadenaGetPublic(
      encryptionKey,
      encryptedSeed,
      [keyIndex, keyIndex + quantity - 1],
      derivationPathTemplate,
    );

    const updatedKeyStore = {
      ...keyStore,
      publicKeys: [...keyStore.publicKeys, ...newPublicKeys],
    };

    await walletRepository.updateKeyStore(updatedKeyStore);

    const updatedKeyStores = keyStores.map((store) => {
      if (store.uuid === updatedKeyStore.uuid) {
        return updatedKeyStore;
      }
      return store;
    });

    setKeyStores([...updatedKeyStores]);
    return newPublicKeys;
  };

  const sign = (TXs: IUnsignedCommand[]) => {
    if (!encryptedSeed) {
      throw new Error('Wallet is not unlocked');
    }
    const signedTx = Promise.all(
      TXs.map(async (Tx) => {
        const signatures = await Promise.all(
          keyStores.map(async ({ publicKeys, derivationPathTemplate }) => {
            const cmd: IPactCommand = JSON.parse(Tx.cmd);
            const relevantIndexes = cmd.signers
              .map((signer) =>
                publicKeys.findIndex(
                  (publicKey) => publicKey === signer.pubKey,
                ),
              )
              .filter((index) => index !== undefined) as number[];

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

  const decryptMnemonic = async (password: string) => {
    if (!encryptedSeed || !activeProfile || !walletRepository) {
      throw new Error('Wallet is not unlocked');
    }
    const encryptedMnemonic = await walletRepository.getEncryptedValue(
      activeProfile.seedKey,
    );
    if (!encryptedMnemonic) {
      throw new Error('No wallet found');
    }
    const decryptedMnemonicBuffer = await kadenaDecrypt(
      password,
      encryptedMnemonic,
    );
    const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
    return mnemonic;
  };

  const lockWallet = () => {
    setEncryptedSeed(undefined);
    setActiveProfile(undefined);
  };

  let exposedProfile: Exclude<IProfile, 'seedKey'> | undefined;
  if (activeProfile) {
    exposedProfile = { ...activeProfile, seedKey: '' };
  }

  return (
    <WalletContext.Provider
      value={{
        createWallet,
        unlockWallet,
        lockWallet,
        createPublicKeys,
        keyStores,
        sign,
        decryptMnemonic,
        isUnlocked: Boolean(encryptedSeed),
        profile: exposedProfile,
        profileList,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
