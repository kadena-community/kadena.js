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
  IProfile,
  WalletRepository,
  createWalletRepository,
} from './wallet.repository';
import { IWalletService, walletFactory } from './wallet.service';

type ProfileWithAccounts = IProfile & { accounts: IAccount[] };

export const WalletContext = createContext<{
  createWallet: (
    profile: string,
    password: string,
    mnemonic: string,
  ) => Promise<void>;
  unlockWallet: (profile: string, password: string) => Promise<void>;
  sign: (TXs: IUnsignedCommand[]) => Promise<IUnsignedCommand[]>;
  isUnlocked: boolean;
  decryptMnemonic: (password: string) => Promise<string>;
  lockWallet: () => void;
  profile: ProfileWithAccounts | undefined;
  profileList: Pick<IProfile, 'name' | 'uuid'>[];
} | null>(null);

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [walletRepository, setWalletRepository] = useState<WalletRepository>();
  const [walletService, setWalletService] = useState<IWalletService>();

  const [activeProfile, setActiveProfile] = useState<
    IProfile & { accounts: IAccount[] }
  >();
  const [profileList, setProfileList] = useState<
    Pick<IProfile, 'name' | 'uuid'>[]
  >([]);

  useEffect(() => {
    const wrPromise = createWalletRepository()
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
      wrPromise.then((store) => store?.disconnect());
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

    const profile = await service.getProfile();
    const profileAccounts = await service.getAccounts();
    const profileAndAccounts = {
      ...profile,
      accounts: profileAccounts,
    };
    setWalletService(service);
    setActiveProfile(profileAndAccounts);
    setProfileList(
      [...profileList, profile].map(({ name, uuid }) => ({ name, uuid })),
    );
  };

  const unlockWallet = async (profileId: string, password: string) => {
    if (!walletRepository) {
      throw new Error('Wallet repository not initialized');
    }
    const service = await walletFactory(walletRepository).unlockWallet(
      profileId,
      password,
    );
    const profile = await service.getProfile();
    const profileAccounts = await service.getAccounts();
    const profileAndAccounts = {
      ...profile,
      accounts: profileAccounts,
    };
    setWalletService(service);
    setActiveProfile(profileAndAccounts);
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

  let exposedProfile: ProfileWithAccounts | undefined;
  if (activeProfile) {
    exposedProfile = { ...activeProfile, seedKey: '' };
  }

  return (
    <WalletContext.Provider
      value={{
        createWallet,
        unlockWallet,
        lockWallet,
        sign,
        decryptMnemonic,
        isUnlocked: Boolean(walletService),
        profile: exposedProfile,
        profileList,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
