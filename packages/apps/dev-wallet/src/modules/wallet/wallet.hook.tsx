import { config } from '@/config';
import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';
import * as AccountService from '../account/account.service';
import { BIP44Service } from '../key-source/hd-wallet/BIP44';
import { ChainweaverService } from '../key-source/hd-wallet/chainweaver';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import { UUID } from '../types';
import { ExtWalletContextType, WalletContext } from './wallet.provider';
import { IKeySource, IProfile } from './wallet.repository';
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
  const [
    context,
    setProfile,
    setActiveNetwork,
    syncAllAccounts,
    askForPassword,
  ] = useContext(WalletContext) ?? [];
  if (!context || !setProfile || !askForPassword) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  const createProfile = useCallback(
    async (
      profileName: string = 'default',
      password: string,
      accentColor: string | undefined,
      options: IProfile['options'],
      securityPhrase: string | Uint8Array,
    ) => {
      const profile = await WalletService.createProfile(
        profileName,
        password,
        [],
        accentColor ?? config.defaultAccentColor,
        options,
        securityPhrase,
      );
      return profile;
    },
    [],
  );

  const unlockProfile = useCallback(
    async (profileId: string, password: string) => {
      console.log('unlockProfile', profileId, password);
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

  const unlockKeySource = useCallback(
    async (keySource: IKeySource) => {
      const password = await askForPassword();
      if (!password) {
        throw new Error('Password is required');
      }
      const service = (await keySourceManager.get(keySource.source)) as
        | ChainweaverService
        | BIP44Service;

      await service.connect(password, keySource as any);

      if (!service.isConnected()) {
        throw new Error('Failed to unlock key source');
      }
    },
    [askForPassword],
  );

  const lockKeySource = useCallback(async (keySource: IKeySource) => {
    const service = await keySourceManager.get(keySource.source);
    if (service) {
      service.disconnect();
    }
  }, []);

  const sign = useCallback(
    async (
      TXs: IUnsignedCommand | IUnsignedCommand[],
      publicKeys?: string[],
    ) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      if (Array.isArray(TXs)) {
        const res = await WalletService.sign(
          context.keySources,
          unlockKeySource,
          TXs,
          publicKeys,
        );
        keySourceManager.disconnect();
        return res;
      }
      const res = await WalletService.sign(
        context.keySources,
        unlockKeySource,
        [TXs],
        publicKeys,
      ).then((res) => res[0]);
      keySourceManager.disconnect();
      return res;
    },
    [context, unlockKeySource],
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
    const res = await WalletService.createKey(keySource, unlockKeySource);
    keySourceManager.disconnect();
    return res;
  }, []);

  const getPublicKeyData = useCallback(
    (publicKey: string) => {
      if (!context.keySources) return null;
      for (const source of context.keySources) {
        for (const key of source.keys) {
          if (key.publicKey === publicKey) {
            return {
              ...key,
              source: source.source,
            };
          }
        }
      }
      return null;
    },
    [context],
  );

  const createKAccount = useCallback(
    async (
      profileId: string,
      networkUUID: UUID,
      publicKey: string,
      contract?: string,
    ) => {
      return AccountService.createKAccount(
        profileId,
        networkUUID,
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
    askForPassword,
    getPublicKeyData,
    unlockKeySource,
    lockKeySource,
    setActiveNetwork: (network: INetwork) =>
      setActiveNetwork ? setActiveNetwork(network) : undefined,
    activeNetwork: context.activeNetwork,
    networks: context.networks,
    isUnlocked: isUnlocked(context),
    profile: context.profile,
    profileList: context.profileList ?? [],
    accounts: context.accounts || [],
    keysets: context.keysets || [],
    keySources: context.keySources || [],
    fungibles: context.fungibles || [],
    client: context.client,
    syncAllAccounts: () => (syncAllAccounts ? syncAllAccounts() : undefined),
  };
};
