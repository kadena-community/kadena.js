import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';

import { keySourceManager } from '../key-source/key-source-manager';
import { ExtWalletContextType, WalletContext } from './wallet.provider';
import { IKeySource, walletRepository } from './wallet.repository';
import * as WalletService from './wallet.service';

const isUnlocked = (
  ctx: ExtWalletContextType,
): ctx is Required<ExtWalletContextType> => {
  if (!ctx || !ctx.profile || !ctx.profileList || !ctx.keySources) {
    return false;
  }
  return true;
};

export const useWallet = () => {
  const [context, setContext] = useContext(WalletContext) ?? [];
  if (!context || !setContext) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  const retrieveKeySources = useCallback(
    async (profileId: string) => {
      const keySources = await walletRepository.getProfileKeySources(profileId);
      setContext((ctx) => ({ ...ctx, keySources }));
      return keySources;
    },
    [setContext],
  );

  const createProfile = useCallback(
    async (profileName: string, password: string) => {
      const profile = await WalletService.createProfile(
        profileName,
        password,
        [],
      );
      const profileInfo = { name: profile.name, uuid: profile.uuid };
      setContext(({ profileList }) => ({
        profile,
        profileList: [...(profileList ?? []), profileInfo],
      }));
      keySourceManager.reset();
      return profile;
    },
    [setContext],
  );

  const createFirstAccount = async (
    profileId: string,
    keySource: IKeySource,
  ) => {
    const account = await WalletService.createFirstAccount(
      profileId,
      keySource,
    );

    const keySources = await walletRepository.getProfileKeySources(profileId);

    setContext((ctx) => ({
      ...ctx,
      keySources,
      accounts: [account],
    }));
  };

  const retrieveAccounts = useCallback(
    async (profileId: string) => {
      const accounts = await WalletService.getAccounts(profileId);
      console.log('retrieveAccounts', 'profileId', profileId, accounts);
      setContext((ctx) => ({
        ...ctx,
        accounts,
      }));
    },
    [setContext],
  );

  const unlockProfile = useCallback(
    async (profileId: string, password: string) => {
      const profile = await WalletService.unlockProfile(profileId, password);
      if (profile) {
        const accounts = await WalletService.getAccounts(profileId);
        const keySources =
          await walletRepository.getProfileKeySources(profileId);
        // by default unlock the first key source; we can change this approach later
        setContext(({ profileList }) => ({
          profileList,
          profile,
          accounts,
          keySources,
        }));
        keySourceManager.reset();
        return { profile, keySources };
      }
      return null;
    },
    [setContext],
  );

  const lockProfile = useCallback(() => {
    keySourceManager.reset();
    setContext(({ profileList }) => ({ profileList }));
  }, [setContext]);

  const sign = useCallback(
    async (
      TXs: IUnsignedCommand[],
      onConnect: (keySource: IKeySource) => Promise<void> = async () => {},
    ) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      return WalletService.sign(context.keySources, onConnect, TXs);
    },
    [context],
  );

  const decryptSecret = useCallback(
    async (password: string, secretId: string) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      return WalletService.decryptSecret(password, secretId);
    },
    [context],
  );

  return {
    createProfile,
    createFirstAccount,
    unlockProfile,
    sign,
    decryptSecret,
    lockProfile,
    retrieveKeySources,
    retrieveAccounts,
    isUnlocked: isUnlocked(context),
    profile: context.profile,
    profileList: context.profileList ?? [],
    accounts: context.accounts ?? [],
    keySources: context.keySources ?? [],
  };
};

export const useWalletContext = () => {
  const [context] = useContext(WalletContext) ?? [];
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
