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
  IKeySource,
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
  keySources: IKeySource[];
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
  const [keySources, setKeySources] = useState<IKeySource[]>([]);

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

    const profileKeySources = await service.getKeySources();
    const profileAccounts = await service.getAccounts();
    setAccounts(profileAccounts);
    setKeySources(profileKeySources);
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
    const profileKeySources = await service.getKeySources();
    const profileAccounts = await service.getAccounts();
    setKeySources(profileKeySources);
    setAccounts(profileAccounts);
    setWalletService(service);
    setActiveProfile(service.getProfile());
  };

  const createKeySource = async (derivationPathTemplate: string) => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    const keySource = await walletService.createKeySource(
      derivationPathTemplate,
    );
    keySources.push(keySource);
    setKeySources([...keySources]);
    return keySource;
  };

  const createPublicKeys = async (
    quantity = 1,
    derivationPathTemplate = `m'/44'/626'/<index>'`,
  ): Promise<IKeyItem[]> => {
    if (!walletService) {
      throw new Error('Wallet is not unlocked');
    }
    let keySource = keySources.find(
      (store) =>
        store.derivationPathTemplate === derivationPathTemplate &&
        store.source === 'hd-wallet',
    );

    if (!keySource) {
      keySource = await createKeySource(derivationPathTemplate);
    }

    const newPublicKeys = await walletService.createPublicKeys(
      quantity,
      keySource.uuid,
    );

    const updatedKeySource = {
      ...keySource,
      publicKeys: [
        ...keySource.publicKeys,
        ...newPublicKeys.map((k) => k.publicKey),
      ],
    };

    const updatedKeySources = keySources.map((store) => {
      if (store.uuid === updatedKeySource.uuid) {
        return updatedKeySource;
      }
      return store;
    });

    setKeySources([...updatedKeySources]);
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
        keySources: keySources,
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
