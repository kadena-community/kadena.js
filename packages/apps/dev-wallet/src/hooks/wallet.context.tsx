import { IUnsignedCommand } from '@kadena/client';

import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import {
  IAccount,
  IKeyItem,
  IKeyStore,
  IProfile,
  WalletRepository,
  createWalletRepository,
} from './wallet.repository';
import { IWalletService, walletFactory } from './wallet.service';

export const WalletContext = createContext<{
  createWallet: (
    profile: string,
    password: string,
    mnemonic: string,
  ) => Promise<void>;
  unlockWallet: (profile: string, password: string) => Promise<void>;
  createPublicKeys: (quantity?: number) => Promise<IKeyItem[]>;
  sign: (TXs: IUnsignedCommand[]) => Promise<IUnsignedCommand[]>;
  keyStores: IKeyStore[];
  isUnlocked: boolean;
  decryptMnemonic: (password: string) => Promise<string>;
  lockWallet: () => void;
  profile: Omit<IProfile, 'HDWalletSeedKey'> | undefined;
  profileList: Omit<IProfile, 'HDWalletSeedKey' | 'networks'>[];
  // TODO: move account to separate context if needed
  accounts: IAccount[];
  createAccount: (account: IAccount) => Promise<void>;
} | null>(null);

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [walletRepository, setWalletRepository] = useState<WalletRepository>();
  const [walletService, setWalletService] = useState<IWalletService>();

  const [activeProfile, setActiveProfile] = useState<IProfile>();
  const [profileList, setProfileList] = useState<IProfile[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [keyStores, setKeyStores] = useState<IKeyStore[]>([]);

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
    const service = await walletFactory(walletRepository).createWallet(
      profileName,
      password,
      mnemonic,
    );

    const profileKeyStores = await service.getKeyStores();
    const profileAccounts = await service.getAccounts();
    setAccounts(profileAccounts);
    setKeyStores(profileKeyStores);
    setWalletService(service);
    setActiveProfile(service.getProfile());
    setProfileList([...profileList, service.getProfile()]);
  };

  const unlockWallet = async (profileId: string, password: string) => {
    if (!walletRepository) {
      throw new Error('Wallet repository not initialized');
    }
    const service = await walletFactory(walletRepository).unlockWallet(
      profileId,
      password,
    );
    const profileKeyStores = await service.getKeyStores();
    const profileAccounts = await service.getAccounts();
    setKeyStores(profileKeyStores);
    setAccounts(profileAccounts);
    setWalletService(service);
    setActiveProfile(service.getProfile());
  };

  const createKeyStore = async (derivationPathTemplate: string) => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    const keyStore = await walletService.createKeyStore(derivationPathTemplate);
    keyStores.push(keyStore);
    setKeyStores([...keyStores]);
    return keyStore;
  };

  const createPublicKeys = async (
    quantity = 1,
    derivationPathTemplate = `m'/44'/626'/<index>'`,
  ): Promise<IKeyItem[]> => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    let keyStore = keyStores.find(
      (store) =>
        store.derivationPathTemplate === derivationPathTemplate &&
        store.source === 'hd-wallet',
    );

    if (!keyStore) {
      keyStore = await createKeyStore(derivationPathTemplate);
    }

    const newPublicKeys = await walletService.createPublicKeys(
      quantity,
      keyStore.uuid,
    );

    const updatedKeyStore = {
      ...keyStore,
      publicKeys: [
        ...keyStore.publicKeys,
        ...newPublicKeys.map((k) => k.publicKey),
      ],
    };

    const updatedKeyStores = keyStores.map((store) => {
      if (store.uuid === updatedKeyStore.uuid) {
        return updatedKeyStore;
      }
      return store;
    });

    setKeyStores([...updatedKeyStores]);
    return newPublicKeys;
  };

  const createAccount = async (account: IAccount) => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    await walletService.createAccount(account);
    setAccounts([...accounts, account]);
  };

  const sign = (TXs: IUnsignedCommand[]) => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    return walletService.sign(TXs);
  };

  const decryptMnemonic = async (password: string) => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    return walletService.decryptMnemonic(password);
  };

  const lockWallet = () => {
    setWalletService(undefined);
    setActiveProfile(undefined);
  };

  let exposedProfile: Exclude<IProfile, 'HDWalletSeedKey'> | undefined;
  if (activeProfile) {
    exposedProfile = { ...activeProfile, HDWalletSeedKey: '' };
  }

  return (
    <WalletContext.Provider
      value={{
        createWallet,
        unlockWallet,
        lockWallet,
        createPublicKeys: createPublicKeys,
        keyStores,
        sign,
        decryptMnemonic,
        isUnlocked: Boolean(walletService),
        profile: exposedProfile,
        profileList,
        accounts,
        createAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
