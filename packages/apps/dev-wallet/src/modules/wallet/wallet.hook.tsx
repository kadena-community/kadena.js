import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { defaultAccentColor } from '@/modules/layout/layout.provider.tsx';
import { recoverPublicKey, retrieveCredential } from '@/utils/webAuthn';
import { IUnsignedCommand } from '@kadena/client';
import { useCallback, useContext } from 'react';
import { UnlockPrompt } from '../../Components/UnlockPrompt/UnlockPrompt';
import * as AccountService from '../account/account.service';
import { BIP44Service } from '../key-source/hd-wallet/BIP44';
import { ChainweaverService } from '../key-source/hd-wallet/chainweaver';
import { keySourceManager } from '../key-source/key-source-manager';
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
          console.log('unlocking with password');
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
              console.log('Key source unlocked with: ', key);
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
    [context],
  );

  const sign = useCallback(
    async (TXs: IUnsignedCommand[]) => {
      if (!isUnlocked(context)) {
        throw new Error('Wallet in not unlocked');
      }
      return WalletService.sign(context.keySources, unlockKeySource, TXs);
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
