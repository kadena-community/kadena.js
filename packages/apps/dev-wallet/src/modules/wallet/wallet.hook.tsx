import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';

import { KeySourceWithSecret } from '../key-source/interface';
import {
  IKeySourceManager,
  createKeySourceManager,
} from '../key-source/keySourceService';
import { ExtWalletContextType, WalletContext } from './wallet.provider';
import {
  IKeySource,
  IProfile,
  createWalletRepository,
} from './wallet.repository';
import * as WalletService from './wallet.service';

const isUnlocked = (
  ctx: ExtWalletContextType,
): ctx is Required<ExtWalletContextType> => {
  if (!ctx || !ctx.keySourceManager || !ctx.profile || !ctx.profileList) {
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
      const walletRepository = await createWalletRepository();
      const profile = await WalletService.createProfile(
        { walletRepository },
        profileName,
        password,
        [],
      );
      const profileInfo = { name: profile.name, uuid: profile.uuid };
      const keySourceManager = createKeySourceManager();
      setContext(({ profileList }) => ({
        profile,
        profileList: [...(profileList ?? []), profileInfo],
        keySourceManager,
      }));
      return { profile, keySourceManager };
    },
    [setContext],
  );

  const createFirstAccount = async (
    ctx: { keySourceManager: IKeySourceManager; profile: IProfile },
    keySource: KeySourceWithSecret,
  ) => {
    const walletRepository = await createWalletRepository();
    const { keySourceManager, profile } = ctx;
    const account = await WalletService.createFirstAccount(
      { walletRepository, keySourceManager, profile },
      keySource,
    );

    const updatedProfile = await WalletService.getProfile({
      walletRepository,
      profile,
    });

    setContext((ctx) => ({
      ...ctx,
      profile: updatedProfile,
      accounts: [account],
    }));
  };

  const unlockProfile = async (profileId: string, password: string) => {
    const walletRepository = await createWalletRepository();
    const profile = await WalletService.unlockProfile(
      { walletRepository },
      profileId,
      password,
    );
    if (profile) {
      const accounts = await WalletService.getAccounts({
        walletRepository,
        profile,
      });
      // by default unlock the first key source; we can change this approach later
      const keySourceManager = createKeySourceManager();
      setContext(({ profileList }) => ({
        profileList,
        profile,
        accounts,
        keySourceManager,
      }));
      return { profile, keySourceManager };
    }
    return null;
  };

  const lockProfile = useCallback(() => {
    setContext(({ profileList }) => ({ profileList }));
  }, [setContext]);

  const sign = useCallback(
    async (
      TXs: IUnsignedCommand[],
      onConnect: (keySource: IKeySource) => Promise<void> = async () => {},
    ) => {
      const walletRepository = await createWalletRepository();
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      return WalletService.sign(
        { walletRepository, ...context },
        onConnect,
        TXs,
      );
    },
    [context],
  );

  const decryptSecret = useCallback(
    async (password: string, secretId: string) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      const walletRepository = await createWalletRepository();
      return WalletService.decryptSecret(
        { walletRepository },
        password,
        secretId,
      );
    },
    [context],
  );

  const getSecret = useCallback(async (secretId: string) => {
    const walletRepository = await createWalletRepository();
    return WalletService.getSecret({ walletRepository }, secretId);
  }, []);

  return {
    createProfile,
    createFirstAccount,
    unlockProfile,
    sign,
    decryptSecret,
    lockProfile,
    getSecret,
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
