import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';

import { keySourceManager } from '../key-source/key-source-manager';
import { ExtWalletContextType, WalletContext } from './wallet.provider';
import { IKeySource } from './wallet.repository';
import * as WalletService from './wallet.service';

const isUnlocked = (
  ctx: ExtWalletContextType,
): ctx is Required<ExtWalletContextType> => {
  if (!ctx || !ctx.profile || !ctx.profileList) {
    return false;
  }
  return true;
};

export const useWallet = () => {
  const [context, setContext] = useContext(WalletContext) ?? [];
  if (!context || !setContext) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

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

    const updatedProfile = await WalletService.getProfile(profileId);

    setContext((ctx) => ({
      ...ctx,
      profile: updatedProfile,
      accounts: [account],
    }));
  };

  const unlockProfile = async (profileId: string, password: string) => {
    const profile = await WalletService.unlockProfile(profileId, password);
    if (profile) {
      const accounts = await WalletService.getAccounts(profileId);
      // by default unlock the first key source; we can change this approach later
      setContext(({ profileList }) => ({
        profileList,
        profile,
        accounts,
      }));
      keySourceManager.reset();
      return profile;
    }
    return null;
  };

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
      return WalletService.sign(context.profile, onConnect, TXs);
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
    isUnlocked: isUnlocked(context),
    profile: context.profile,
    profileList: context.profileList ?? [],
    accounts: context.accounts ?? [],
  };
};

export const useWalletContext = () => {
  const [context] = useContext(WalletContext) ?? [];
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
