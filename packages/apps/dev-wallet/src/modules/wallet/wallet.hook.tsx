import { config } from '@/config';
import { IUnsignedCommand } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { useCallback, useContext } from 'react';
import {
  accountRepository,
  IAccount,
  IKeySet,
} from '../account/account.repository';
import * as AccountService from '../account/account.service';
import { BIP44Service } from '../key-source/hd-wallet/BIP44';
import { ChainweaverService } from '../key-source/hd-wallet/chainweaver';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import { UUID } from '../types';
import { ExtWalletContextType, WalletContext } from './wallet.provider';
import { IKeyItem, IKeySource, IProfile } from './wallet.repository';
import * as WalletService from './wallet.service';

const isUnlocked = (
  ctx: ExtWalletContextType,
): ctx is Required<ExtWalletContextType> => {
  if (!ctx || !ctx.profile) {
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

  const createAccountByKeyset = async ({
    keyset,
    contract,
    alias,
  }: {
    keyset: IKeySet;
    contract: string;
    alias?: string;
  }) => {
    if (!context.profile || !context.activeNetwork) {
      throw new Error('Profile or active network not found');
    }
    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || '',
      profileId: context.profile.uuid,
      address: keyset.principal,
      keysetId: keyset.uuid,
      networkUUID: context.activeNetwork.uuid,
      contract,
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addAccount(account);
  };

  const createAccountByKey = async ({
    key,
    contract,
    alias,
  }: {
    key: IKeyItem;
    contract: string;
    alias?: string;
  }) => {
    const { profile, activeNetwork } = context;
    if (!profile || !activeNetwork || !contract) {
      throw new Error('Profile or active network not found');
    }

    const guard = {
      keys: [key.publicKey],
      pred: 'keys-all' as const,
    };

    const principal = await createPrincipal({ keyset: guard }, {});

    let keyset = await accountRepository.getKeysetByPrincipal(
      principal,
      profile.uuid,
    );

    if (!keyset) {
      keyset = {
        principal: principal,
        guard: guard,
        profileId: profile.uuid,
        uuid: crypto.randomUUID(),
      };
      await accountRepository.addKeyset(keyset);
    }

    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || '',
      profileId: profile.uuid,
      address: keyset.principal,
      keysetId: keyset.uuid,
      networkUUID: activeNetwork.uuid,
      contract,
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addAccount(account);

    return account;
  };

  const createNextAccount = async ({
    contract,
    alias,
  }: {
    contract: string;
    alias?: string;
  }) => {
    const { accounts } = context;
    const filteredAccounts = accounts.filter(
      (account) => account.contract === contract,
    );
    const usedKeys = filteredAccounts.map((account) => {
      const keys = account.keyset?.guard.keys;
      if (keys?.length === 1 && account.keyset?.guard.pred === 'keys-all') {
        return keys[0];
      }
    });
    const keySource = context.keySources[0];
    const availableKey = keySource.keys.find(
      (key) => !usedKeys.includes(key.publicKey),
    );
    // prompt for password anyway for account creation even if the key is available.
    await askForPassword();
    if (availableKey) {
      return createAccountByKey({ key: availableKey, contract, alias });
    }
    // If no available key, create a new one
    const key = await createKey(keySource);
    return createAccountByKey({ key, contract, alias });
  };

  const getContact = (id: string) => {
    return context.contacts.find(
      (contact) => contact.uuid.toLocaleLowerCase() === id.toLocaleLowerCase(),
    );
  };
  const getNetwork = (id: string) => {
    return context.networks.find(
      (network) => network.uuid.toLocaleLowerCase() === id?.toLowerCase(),
    );
  };

  return {
    getContact,
    getNetwork,
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
    createNextAccount,
    createAccountByKeyset,
    createAccountByKey,
    setActiveNetwork: (network: INetwork) =>
      setActiveNetwork ? setActiveNetwork(network) : undefined,
    syncAllAccounts: () => (syncAllAccounts ? syncAllAccounts() : undefined),
    isUnlocked: isUnlocked(context),
    ...context,
  };
};
