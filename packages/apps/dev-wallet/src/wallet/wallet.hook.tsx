import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';
import { ExtWalletContextType, WalletContext } from './wallet.context';
import * as WalletService from './wallet.service';

const isUnlocked = (
  ctx: ExtWalletContextType,
): ctx is Required<ExtWalletContextType> => {
  if (
    !ctx ||
    !ctx.accounts ||
    !ctx.encryptedSeed ||
    !ctx.encryptionKey ||
    !ctx.profile ||
    !ctx.profileList ||
    !ctx.walletRepository
  ) {
    return false;
  }
  return true;
};

export const useWallet = () => {
  const [context, setContext] = useContext(WalletContext) ?? [];
  if (!context || !setContext) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  const { walletRepository } = context;

  const createWallet = useCallback(
    async (profileName: string, password: string, mnemonic: string) => {
      if (!walletRepository) {
        throw new Error('Wallet repository not initialized');
      }
      const ctx = await WalletService.createWallet(
        walletRepository,
        profileName,
        password,
        mnemonic,
      );

      const profile = await WalletService.getProfile(ctx);
      const accounts = await WalletService.getAccounts(ctx);
      const profileInfo = { name: profile.name, uuid: profile.uuid };
      setContext(({ profileList }) => ({
        ...ctx,
        profile,
        accounts,
        profileList: [...(profileList ?? []), profileInfo],
      }));
    },
    [walletRepository, setContext],
  );

  const unlockWallet = useCallback(
    async (profileId: string, password: string) => {
      if (!walletRepository) {
        throw new Error('Wallet repository not initialized');
      }
      const ctx = await WalletService.unlockWallet(
        walletRepository,
        profileId,
        password,
      );
      const profile = await WalletService.getProfile(ctx);
      const accounts = await WalletService.getAccounts(ctx);
      setContext(({ profileList }) => ({
        ...ctx,
        profile,
        accounts,
        profileList,
      }));
    },
    [walletRepository, setContext],
  );

  const lockWallet = useCallback(() => {
    setContext(({ walletRepository }) => ({
      walletRepository,
    }));
  }, [setContext]);

  const sign = useCallback(
    (TXs: IUnsignedCommand[]) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      return WalletService.sign(context, TXs);
    },
    [context],
  );

  const decryptMnemonic = useCallback(
    async (password: string) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      return WalletService.decryptMnemonic(context, password);
    },
    [context],
  );

  return {
    createWallet,
    unlockWallet,
    sign,
    decryptMnemonic,
    lockWallet,
    isUnlocked: isUnlocked(context),
    profile: context.profile,
    profileList: context.profileList ?? [],
    accounts: context.accounts ?? [],
  };
};
