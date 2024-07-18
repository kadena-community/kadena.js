import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { defaultAccentColor } from '@/modules/layout/layout.provider.tsx';
import { recoverPublicKey, retrieveCredential } from '@/utils/webAuthn';
import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext, useEffect } from 'react';
import { UnlockPrompt } from '../../Components/UnlockPrompt/UnlockPrompt';
import * as AccountService from '../account/account.service';
import { BIP44Service } from '../key-source/hd-wallet/BIP44';
import { ChainweaverService } from '../key-source/hd-wallet/chainweaver';
import { keySourceManager } from '../key-source/key-source-manager';
import {
  ExtWalletContextType,
  WalletContext,
  syncAllAccounts,
} from './wallet.provider';
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
  const [context, setProfile] = useContext(WalletContext) ?? [];
  const prompt = usePrompt();
  if (!context || !setProfile) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  const createProfile = useCallback(
    async (
      profileName: string = 'default',
      password: string,
      accentColor: string = defaultAccentColor,
      options: IProfile['options'],
    ) => {
      const profile = await WalletService.createProfile(
        profileName,
        password,
        [],
        accentColor,
        options,
      );
      return profile;
    },
    [],
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

  const unlockKeySource = useCallback(
    async (keySource: IKeySource) => {
      const { profile } = context;
      // for now we use the same password as the profile password
      // later we have different password for key sources. we need to handle that.
      // we check the auth mode of the profile and use the appropriate password/web-authn to unlock the key source
      switch (profile?.options.authMode) {
        case 'PASSWORD': {
          const pass = await prompt((resolve, reject) => (
            <UnlockPrompt resolve={resolve} reject={reject} />
          ));
          if (!pass) {
            throw new Error('Password is required');
          }
          const service = (await keySourceManager.get(keySource.source)) as
            | ChainweaverService
            | BIP44Service;

          await service.connect(pass as string, keySource as any);
          break;
        }
        case 'WEB_AUTHN': {
          const credentialId = profile.options.webAuthnCredential;
          const credential = await retrieveCredential(credentialId);
          if (!credential) {
            throw new Error('Failed to retrieve credential');
          }
          const keys = await recoverPublicKey(credential);
          const service = (await keySourceManager.get(keySource.source)) as
            | ChainweaverService
            | BIP44Service;
          for (const key of keys) {
            try {
              await service.connect(key, keySource as any);
              break;
            } catch (e) {
              continue;
            }
          }
          if (!service.isConnected()) {
            throw new Error('Failed to unlock key source');
          }
          break;
        }
        default: {
          throw new Error('Unsupported auth mode');
        }
      }
    },
    [context, prompt],
  );

  const askForPassword = useCallback(async (): Promise<string | null> => {
    const { profile } = context;
    if (!profile) {
      return null;
    }
    // for now we use the same password as the profile password
    // later we have different password for key sources. we need to handle that.
    // we check the auth mode of the profile and use the appropriate password/web-authn to unlock the key source
    switch (profile.options.authMode) {
      case 'PASSWORD': {
        const pass = (await prompt((resolve, reject) => (
          <UnlockPrompt resolve={resolve} reject={reject} />
        ))) as string;
        if (!pass) {
          return null;
        }
        const result = await WalletService.unlockProfile(profile.uuid, pass);
        if (!result) return null;
        return pass;
      }
      case 'WEB_AUTHN': {
        const credentialId = profile.options.webAuthnCredential;
        const credential = await retrieveCredential(credentialId);
        if (!credential) {
          return null;
        }
        const keys = await recoverPublicKey(credential);
        for (const key of keys) {
          const result = await WalletService.unlockProfile(profile.uuid, key);
          if (result) {
            return key;
          }
        }
        return null;
      }
      default: {
        throw new Error('Unsupported auth mode');
      }
    }
  }, [context, prompt]);

  const sign = useCallback(
    async (
      TXs: IUnsignedCommand | IUnsignedCommand[],
      publicKeys?: string[],
    ) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      if (Array.isArray(TXs)) {
        return WalletService.sign(
          context.keySources,
          unlockKeySource,
          TXs,
          publicKeys,
        );
      }
      return WalletService.sign(
        context.keySources,
        unlockKeySource,
        [TXs],
        publicKeys,
      ).then((res) => res[0]);
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
    return WalletService.createKey(keySource, unlockKeySource);
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

  useEffect(() => {
    if (context.profile?.uuid) {
      syncAllAccounts(context.profile?.uuid);
    }
  }, [context.profile]);

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
    isUnlocked: isUnlocked(context),
    profile: context.profile,
    profileList: context.profileList ?? [],
    accounts: context.accounts || [],
    keySources: context.keySources || [],
    fungibles: context.fungibles || [],
  };
};
