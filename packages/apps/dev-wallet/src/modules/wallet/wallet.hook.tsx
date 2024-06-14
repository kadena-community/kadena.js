import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';

import { defaultAccentColor } from '@/modules/layout/layout.provider.tsx';
import * as AccountService from '../account/account.service';
import { ExtWalletContextType, WalletContext } from './wallet.provider';
import { IKeySource } from './wallet.repository';
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
  const [context, setProfile] = useContext(WalletContext) ?? [];
  if (!context || !setProfile) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  const createProfile = useCallback(
    async (
      profileName: string = 'default',
      password: string,
      accentColor: string = defaultAccentColor,
    ) => {
      const profile = await WalletService.createProfile(
        profileName,
        password,
        [],
        accentColor,
      );
      await setProfile(profile);
      return profile;
    },
    [setProfile],
  );

  const unlockProfile = useCallback(
    async (profileId: string, password: string) => {
      const profile = await WalletService.unlockProfile(profileId, password);
      if (profile) {
        return setProfile(profile);
      }
      return null;
    },
    [setProfile],
  );

  const lockProfile = useCallback(() => {
    setProfile(undefined);
  }, [setProfile]);

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

  const createKey = useCallback(async (keySource: IKeySource) => {
    return WalletService.createKey(keySource);
  }, []);

  const createKAccount = useCallback(
    async (
      profileId: string,
      networkId: string,
      publicKey: string,
      contract?: string,
    ) => {
      return AccountService.createKAccount(
        profileId,
        networkId,
        publicKey,
        contract,
      );
    },
    [],
  );

  return {
    createProfile,
    unlockProfile,
    createKey,
    createKAccount,
    sign,
    decryptSecret,
    lockProfile,
    isUnlocked: isUnlocked(context),
    profile: context.profile,
    profileList: context.profileList ?? [],
    accounts: context.accounts || [],
    keySources: context.keySources || [],
  };
};
