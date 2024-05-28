import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext, useEffect } from 'react';

import { defaultAccentColor } from '@/modules/layout/layout.provider.tsx';
import { IAccount } from '../account/account.repository';
import * as AccountService from '../account/account.service';
import { dbService } from '../db/db.service';
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

  const retrieveProfileList = useCallback(async () => {
    const profileList = (await walletRepository.getAllProfiles()).map(
      ({ name, uuid, accentColor }) => ({
        name,
        uuid,
        accentColor,
      }),
    );
    setContext((ctx) => ({ ...ctx, profileList }));
    return profileList;
  }, [setContext]);

  const retrieveKeySources = useCallback(
    async (profileId: string) => {
      const keySources = await walletRepository.getProfileKeySources(profileId);
      setContext((ctx) => ({ ...ctx, keySources }));
      return keySources;
    },
    [setContext],
  );

  const retrieveAccounts = useCallback(
    async (profileId: string) => {
      const accounts = await WalletService.getAccounts(profileId);
      setContext((ctx) => ({
        ...ctx,
        accounts,
      }));
    },
    [setContext],
  );

  const createProfile = useCallback(
    async (
      profileName: string,
      password: string,
      accentColor: string = defaultAccentColor,
    ) => {
      const profile = await WalletService.createProfile(
        profileName,
        password,
        [],
        accentColor,
      );
      setContext((ctx) => ({
        ...ctx,
        profile,
      }));
      keySourceManager.reset();
      return profile;
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
        // we sync all accounts when the profile is unlocked;
        // no need to wait for the result the data will be updated in the db
        AccountService.syncAllAccounts(profile.uuid);
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

  // subscribe to db changes and update the context
  useEffect(() => {
    const unsubscribe = dbService.subscribe((event, storeName, data) => {
      if (!['add', 'update', 'delete'].includes(event)) return;
      // update the context when the db changes
      switch (storeName) {
        case 'profile': {
          retrieveProfileList();
          break;
        }
        case 'keySource':
          if (data && (data as IKeySource).profileId) {
            retrieveKeySources(data.profileId);
          }
          break;
        case 'account':
          if (data && (data as IAccount).profileId) {
            retrieveAccounts(data.profileId);
          }
          break;
        default:
          break;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [retrieveProfileList, retrieveKeySources, retrieveAccounts]);

  return {
    createProfile,
    unlockProfile,
    createKey,
    createKAccount,
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
