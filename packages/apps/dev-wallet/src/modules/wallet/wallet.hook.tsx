import { config } from '@/config';
import { Session } from '@/utils/session';
import { IUnsignedCommand } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { useCallback, useContext, useMemo } from 'react';
import {
  accountRepository,
  IAccount,
  IKeySet,
  IOwnedAccount,
  IWatchedAccount,
} from '../account/account.repository';
import { isKeysetGuard } from '../account/guards';
import { backupDatabase } from '../backup/backup.service';
import { BIP44Service } from '../key-source/hd-wallet/BIP44';
import { ChainweaverService } from '../key-source/hd-wallet/chainweaver';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import { securityService } from '../security/security.service';
import {
  channel,
  ExtWalletContextType,
  WalletContext,
} from './wallet.provider';
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

  const getKeyAlias = useCallback(
    (publicKey: string) => {
      const singleKeyAccount = context.accounts.find(
        (a) =>
          isKeysetGuard(a.guard) &&
          a.guard.keys.length === 1 &&
          a.guard.keys[0] === publicKey,
      );

      if (
        singleKeyAccount &&
        (singleKeyAccount.alias || singleKeyAccount.address.length < 15)
      ) {
        return singleKeyAccount.alias || singleKeyAccount.address;
      }

      const contactSingleKey = context.contacts.find(
        (c) =>
          isKeysetGuard(c.account.guard) &&
          c.account.guard.keys.length === 1 &&
          c.account.guard.keys[0] === publicKey,
      );

      if (
        contactSingleKey &&
        (contactSingleKey.name || contactSingleKey.account.address.length < 15)
      ) {
        return contactSingleKey.name || contactSingleKey.account.address;
      }

      const multiKeyAccount = context.accounts.find(
        (a) =>
          isKeysetGuard(a.guard) &&
          a.guard.keys.length > 1 &&
          a.guard.keys.includes(publicKey),
      );

      if (
        multiKeyAccount &&
        isKeysetGuard(multiKeyAccount.guard) &&
        (multiKeyAccount.alias || multiKeyAccount.address.length < 15)
      ) {
        const name = multiKeyAccount.alias || multiKeyAccount.address;
        return `${name}-key(${multiKeyAccount.guard.keys.indexOf(publicKey) + 1})`;
      }

      const contactMultiKey = context.contacts.find(
        (c) =>
          isKeysetGuard(c.account.guard) &&
          c.account.guard.keys.length > 1 &&
          c.account.guard.keys.includes(publicKey),
      );

      if (
        contactMultiKey &&
        isKeysetGuard(contactMultiKey.account.guard) &&
        (contactMultiKey.name || contactMultiKey.account.address.length < 15)
      ) {
        const name = contactMultiKey.name || contactMultiKey.account.address;
        return `${name}-key(${contactMultiKey.account.guard.keys.indexOf(publicKey) + 1})`;
      }

      return '';
    },
    [context.accounts, context.contacts],
  );

  const getAccountAlias = useCallback(
    (address: string) => {
      const account = context.accounts.find((a) => a.address === address);
      if (account) {
        return account.alias;
      }
      const contact = context.contacts.find(
        (c) => c.account.address === address,
      );
      if (contact) {
        return contact.name;
      }
      return '';
    },
    [context.accounts, context.contacts],
  );

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

  const isOwnedAccount = useCallback(
    (account: IAccount): account is IOwnedAccount =>
      account.profileId === context.profile?.uuid &&
      isKeysetGuard(account.guard) &&
      Boolean(account.guard.keys.find((k) => getPublicKeyData(k))),
    [getPublicKeyData, context.profile?.uuid],
  );

  const accounts = useMemo(() => {
    if (!context.accounts) return [];
    return context.accounts.filter(isOwnedAccount) as IOwnedAccount[];
  }, [context.accounts, isOwnedAccount]);

  const watchAccounts = useMemo(() => {
    if (!context.accounts) return [];
    return context.accounts.filter(
      (ac) => !isOwnedAccount(ac),
    ) as IWatchedAccount[];
  }, [context.accounts, isOwnedAccount]);

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
    async (profileId: string, password: string, unlockSecurity = false) => {
      console.log('unlockProfile', profileId, password);
      const profile = await WalletService.unlockProfile(profileId, password);
      await securityService.clearSecurityPhrase();
      if (profile) {
        const res = await setProfile(profile);
        channel.postMessage({ action: 'switch-profile', payload: profile });
        backupDatabase().catch(console.log);
        if (profile.options.rememberPassword === 'on-login' || unlockSecurity) {
          const sessionEntropy = (await Session.get('sessionId')) as string;
          if (!sessionEntropy) {
            return res;
          }
          await securityService.setSecurityPhrase({
            sessionEntropy,
            phrase: password,
            keepPolicy: 'session',
          });
        }
        return res;
      }
      return null;
    },
    [setProfile],
  );

  const lockProfile = useCallback(() => {
    const run = async () => {
      await securityService.clearSecurityPhrase();
      await setProfile(undefined);
      channel.postMessage({ action: 'switch-profile', payload: undefined });
      backupDatabase(true).catch(console.log);
    };
    run();
  }, [setProfile]);

  const unlockKeySource = useCallback(
    async (keySource: IKeySource) => {
      const password = await askForPassword();
      console.log('unlockKeySource', keySource, password);
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

  const createKey = useCallback(
    async (keySource: IKeySource, index?: number) => {
      const res = await WalletService.createKey(
        keySource,
        unlockKeySource,
        index,
      );
      keySourceManager.disconnect();
      return res;
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
    const account: IOwnedAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || '',
      profileId: context.profile.uuid,
      address: keyset.principal,
      guard: { ...keyset.guard, principal: keyset.principal },
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

    const account: IOwnedAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || '',
      profileId: profile.uuid,
      address: keyset.principal,
      guard: {
        ...guard,
        principal: keyset.principal,
      },
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
    const { accounts, fungibles } = context;
    const symbol = fungibles.find((f) => f.contract === contract)?.symbol;
    const filteredAccounts = accounts.filter(
      (account) => account.contract === contract && isOwnedAccount(account),
    ) as IOwnedAccount[];

    const accountAlias =
      alias ||
      `${contract === 'coin' ? '' : `${symbol} `}Account ${filteredAccounts.length + 1}`;
    const usedKeys = filteredAccounts.map((account) => {
      const keys = account.guard.keys;
      if (keys?.length === 1 && account.guard.pred === 'keys-all') {
        return keys[0];
      }
    });
    const keySource =
      context.keySources.find((ks) => ks.isDefault) || context.keySources[0];
    const availableKey = keySource.keys.find(
      (key) => !usedKeys.includes(key.publicKey),
    );
    if (availableKey) {
      // prompt for password anyway for account creation even if the key is available.
      await askForPassword();
      return createAccountByKey({
        key: availableKey,
        contract,
        alias: accountAlias,
      });
    }
    // If no available key, create a new one
    const key = await createKey(keySource);
    return createAccountByKey({ key, contract, alias: accountAlias });
  };

  const getContact = (id: string) => {
    return context.contacts.find(
      (contact) => contact.uuid?.toLowerCase() === id?.toLowerCase(),
    );
  };

  const createSpecificAccount = async ({
    contract,
    index,
    alias,
  }: {
    contract: string;
    index: number;
    alias?: string;
  }) => {
    const { accounts, fungibles } = context;
    const symbol = fungibles.find((f) => f.contract === contract)?.symbol;
    const filteredAccounts = accounts.filter(
      (account) => account.contract === contract,
    );

    const accountAlias =
      alias ||
      `${contract === 'coin' ? '' : `${symbol} `}Account ${filteredAccounts.length + 1}`;

    const keySource = context.keySources[0];
    const indexKey = await createKey(keySource, index);
    const availableKey = keySource.keys.find(
      (ksKey) => ksKey.publicKey === indexKey.publicKey,
    );
    if (availableKey) {
      // prompt for password anyway for account creation even if the key is available.
      await askForPassword();
      return createAccountByKey({
        key: availableKey,
        contract,
        alias: accountAlias,
      });
    }
    return createAccountByKey({ key: indexKey, contract, alias: accountAlias });
  };

  return {
    getContact,
    createProfile,
    unlockProfile,
    createKey,
    sign,
    decryptSecret,
    lockProfile,
    askForPassword,
    getPublicKeyData,
    unlockKeySource,
    lockKeySource,
    createNextAccount,
    createSpecificAccount,
    createAccountByKeyset,
    createAccountByKey,
    isOwnedAccount,
    setActiveNetwork: (network: INetwork) =>
      setActiveNetwork ? setActiveNetwork(network) : undefined,
    syncAllAccounts: () => (syncAllAccounts ? syncAllAccounts() : undefined),
    isUnlocked: isUnlocked(context),
    ...context,
    accounts,
    watchAccounts,
    getKeyAlias,
    getAccountAlias,
  };
};
