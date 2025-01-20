import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSession } from '@/App/providers/session';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { UnlockPrompt } from '@/Components/UnlockPrompt/UnlockPrompt';
import {
  ISetPhraseResponse,
  ISetSecurityPhrase,
  PasswordKeepPolicy,
} from '@/service-worker/types';
import { throttle } from '@/utils/helpers';
import { Session } from '@/utils/session';
import { IClient, INetworkOptions, createClient } from '@kadena/client';
import { setGlobalConfig } from '@kadena/client-utils/core';
import {
  Fungible,
  IAccount,
  IKeySet,
  accountRepository,
} from '../account/account.repository';
import * as AccountService from '../account/account.service';
import { backupDatabase } from '../backup/backup.service';
import { IContact, contactRepository } from '../contact/contact.repository';
import { dbService } from '../db/db.service';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork, networkRepository } from '../network/network.repository';
import { hostUrlGenerator } from '../network/network.service';
import { securityService } from '../security/security.service';
import { IKeySource, IProfile, walletRepository } from './wallet.repository';
import * as WalletService from './wallet.service';

export type ExtWalletContextType = {
  profile: IProfile | undefined;
  accounts: IAccount[];
  keysets: IKeySet[];
  profileList: Pick<IProfile, 'name' | 'uuid' | 'accentColor' | 'options'>[];
  keySources: IKeySource[];
  fungibles: Fungible[];
  loaded: boolean;
  activeNetwork: (INetwork & { isHealthy?: boolean }) | undefined;
  networks: INetwork[];
  client: IClient;
  contacts: IContact[];
};

export const WalletContext = createContext<
  | [
      ExtWalletContextType,
      setProfile: (profile: IProfile | undefined) => Promise<null | {
        profile: IProfile;
        accounts: IAccount[];
        keySources: IKeySource[];
      }>,
      setActiveNetwork: (activeNetwork: INetwork | undefined) => void,
      syncAllAccounts: (force?: boolean) => void,
      askForPassword: (
        force?: boolean,
        options?: { storePassword?: boolean },
      ) => Promise<string | null>,
    ]
  | null
>(null);

export const syncAllAccounts = throttle(AccountService.syncAllAccounts, 10000);

function usePassword(profile: IProfile | undefined) {
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const prompt = usePrompt();
  const getPassword = useCallback(async () => {
    const phrase = await securityService.getSecurityPhrase(
      (await Session.get('sessionId')) as string,
    );
    return phrase;
  }, []);

  const setPassword = useCallback(
    async (
      password: string,
      keepPolicy: ISetSecurityPhrase['payload']['keepPolicy'],
    ) => {
      const { result } = (await securityService.setSecurityPhrase({
        phrase: password,
        keepPolicy,
        sessionEntropy: (await Session.get('sessionId')) as string,
      })) as ISetPhraseResponse;
      if (result !== 'success') {
        throw new Error('Failed to set password');
      }
    },
    [],
  );

  const askForPassword = useCallback(
    async (
      force = false,
      { storePassword = true } = {},
    ): Promise<string | null> => {
      const profile = profileRef.current;
      console.log('asking for password', profile);
      if (!force) {
        const password = await getPassword();
        if (password) {
          return password;
        }
      }
      if (!profile) {
        return null;
      }
      const storeData = async (unlockOptions: {
        password: string;
        keepOpen: PasswordKeepPolicy;
      }) => {
        if (!unlockOptions.password) {
          return null;
        }
        if (profile.options.rememberPassword !== unlockOptions.keepOpen) {
          walletRepository.updateProfile({
            ...profile,
            options: {
              ...profile.options,
              rememberPassword: unlockOptions.keepOpen,
            },
          });
        }
        if (unlockOptions.keepOpen === 'never') {
          return unlockOptions.password;
        }
        await setPassword(unlockOptions.password, unlockOptions.keepOpen);
      };
      switch (profile.options.authMode) {
        case 'PASSWORD': {
          return (await prompt((resolve, reject) => (
            <UnlockPrompt
              resolve={async (unlockOptions) => {
                const result = await WalletService.unlockProfile(
                  profile.uuid,
                  unlockOptions.password,
                );
                if (!result) {
                  throw new Error('Failed to unlock profile');
                }
                if (storePassword) {
                  await storeData(unlockOptions);
                }
                resolve(unlockOptions.password);
              }}
              reject={reject}
              showPassword
              rememberPassword={profile.options.rememberPassword}
              profile={profile}
              storePassword={storePassword}
            />
          ))) as string;
        }
        case 'WEB_AUTHN': {
          return (await prompt((resolve, reject) => (
            <UnlockPrompt
              resolve={async ({ keepOpen }) => {
                const pass = await WalletService.getWebAuthnPass(profile);
                if (!pass) {
                  throw new Error('Failed to unlock profile');
                }
                const unlockOptions = { password: pass, keepOpen };
                if (storePassword) {
                  await storeData(unlockOptions);
                }
                resolve(unlockOptions.password);
              }}
              reject={reject}
              rememberPassword={profile.options.rememberPassword}
              profile={profile}
              storePassword={storePassword}
            />
          ))) as string;
        }
        default: {
          throw new Error('Unsupported auth mode');
        }
      }
    },
    [getPassword, prompt, setPassword],
  );

  return askForPassword;
}

const getDefaultContext = (): ExtWalletContextType => ({
  // profile related data
  profile: undefined,
  accounts: [],
  keySources: [],
  keysets: [],
  // independent data
  networks: [],
  contacts: [],
  profileList: [],
  fungibles: [],
  loaded: false,
  activeNetwork: undefined,
  // prevent using the client before it's initialized via the useEffect below
  client: createClient(() => {
    throw new Error('client is not initialized properly');
  }),
});

const resetProfileRelatedData = (
  ctx: ExtWalletContextType,
): ExtWalletContextType => ({
  ...ctx,
  profile: undefined,
  accounts: [],
  keySources: [],
  keysets: [],
});

export const channel = new BroadcastChannel('profile-activity');

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [contextValue, setContextValue] = useState<ExtWalletContextType>(() =>
    getDefaultContext(),
  );

  const networkHostFunctionRef =
    useRef<({ networkId, chainId }: INetworkOptions) => string>();

  useEffect(() => {
    channel.onmessage = (event) => {
      const { action, payload } = event.data;
      if (action === 'switch-profile') {
        setProfile(payload, true);
      }
    };
    return () => {
      // channel.close();
    };
  }, []);

  // check network health
  useEffect(() => {
    const interval = setInterval(() => {
      setContextValue((ctx) => {
        const hostUrl = networkHostFunctionRef.current;
        if (hostUrl && ctx.activeNetwork) {
          try {
            hostUrl({ networkId: ctx.activeNetwork.networkId, chainId: '0' });
            if (ctx.activeNetwork.isHealthy === true) return ctx;
            return {
              ...ctx,
              activeNetwork: {
                ...ctx.activeNetwork,
                isHealthy: true,
              },
            };
          } catch (e) {
            if (ctx.activeNetwork.isHealthy === false) return ctx;
            return {
              ...ctx,
              activeNetwork: {
                ...ctx.activeNetwork,
                isHealthy: false,
              },
            };
          }
        }
        return ctx;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = Session.subscribe('expired', () => {
      if (contextValue.profile) {
        setProfile(undefined);
        channel.postMessage({ action: 'switch-profile', payload: undefined });
        backupDatabase(true).catch(console.log);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [contextValue.profile?.uuid]);

  const session = useSession();
  const askForPassword = usePassword(contextValue.profile);

  const retrieveNetworks = useCallback(async () => {
    const networks =
      // show oldest first
      (await networkRepository.getEnabledNetworkList()).reverse() ?? [];
    setContextValue((ctx) => ({
      ...ctx,
      networks,
      activeNetwork:
        ctx.activeNetwork &&
        (!networks.length ||
          networks.find((n) => n.uuid === ctx.activeNetwork?.uuid))
          ? ctx.activeNetwork
          : networks.find((n) => n.default),
    }));

    return networks;
  }, []);

  const retrieveProfileList = useCallback(async () => {
    const profileList = (await walletRepository.getAllProfiles()).map(
      ({ name, uuid, accentColor, options }) => ({
        name,
        uuid,
        accentColor,
        options,
      }),
    );
    setContextValue((ctx) => ({ ...ctx, profileList }));
    return profileList;
  }, []);

  const retrieveKeySources = useCallback(async (profileId: string) => {
    const keySources = await walletRepository.getProfileKeySources(profileId);
    setContextValue((ctx) => ({ ...ctx, keySources }));
    return keySources;
  }, []);

  const retrieveContacts = useCallback(async () => {
    const contacts = await contactRepository.getContactsList();
    setContextValue((ctx) => ({ ...ctx, contacts }));
    return contacts;
  }, []);

  const retrieveAccounts = useCallback(
    async (profileId: string) => {
      if (!contextValue.activeNetwork?.uuid) {
        setContextValue((ctx) => ({
          ...ctx,
          accounts: [],
        }));
        return;
      }
      const accounts = await accountRepository.getAccountsByProfileId(
        profileId,
        contextValue.activeNetwork?.uuid,
      );

      setContextValue((ctx) => ({
        ...ctx,
        accounts,
      }));
    },
    [contextValue.activeNetwork?.uuid],
  );

  const retrieveKeysets = useCallback(async (profileId: string) => {
    const keysets = await accountRepository.getKeysetsByProfileId(profileId);
    setContextValue((ctx) => ({
      ...ctx,
      keysets,
    }));
  }, []);

  const retrieveFungibles = useCallback(async () => {
    const fungibles = await accountRepository.getAllFungibles();
    setContextValue((ctx) => ({ ...ctx, fungibles }));
    console.log('Fungibles', fungibles);
    return fungibles;
  }, []);

  // subscribe to db changes and update the context
  useEffect(() => {
    const unsubscribe = dbService.subscribe(async (event, storeName, data) => {
      if (event === 'import') {
        setContextValue(getDefaultContext());
        await retrieveFungibles();
        await retrieveNetworks();
        await retrieveProfileList();
        await retrieveContacts();
        setContextValue((ctx) => ({ ...ctx, loaded: true }));
      }
      const profileId =
        data && typeof data === 'object' && 'profileId' in data
          ? data.profileId
          : contextValue.profile?.uuid;
      if (profileId && profileId !== contextValue.profile?.uuid) return;
      // update the context when the db changes
      switch (storeName) {
        case 'profile': {
          retrieveProfileList();
          if (data.uuid === contextValue.profile?.uuid) {
            // update the profile in the context
            console.log('profile updated', data);
            setContextValue((ctx) => ({
              ...ctx,
              profile: event === 'delete' ? null : data,
            }));
          }
          break;
        }
        case 'fungible': {
          retrieveFungibles();
          break;
        }
        case 'keySource':
          if (profileId) {
            retrieveKeySources(profileId);
          }
          break;
        case 'account':
          if (profileId) {
            retrieveAccounts(profileId);
          }
          break;
        case 'keyset':
          if (profileId) {
            retrieveKeysets(profileId);
          }
          break;
        case 'contact':
          retrieveContacts();
          break;
        case 'network':
          retrieveNetworks();
          break;
        default:
          break;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [
    retrieveProfileList,
    retrieveKeySources,
    retrieveAccounts,
    retrieveFungibles,
    retrieveKeysets,
    retrieveNetworks,
    contextValue.profile?.uuid,
    retrieveContacts,
  ]);

  const setProfile = useCallback(
    async (profile: IProfile | undefined, noSession = false) => {
      console.log('setting profile', profile);
      if (!profile) {
        console.log('resetting profile');
        keySourceManager.reset();
        session.clear();
        setContextValue(resetProfileRelatedData);
        return null;
      }
      if (!noSession) {
        await session.reset();
        await session.set('profileId', profile.uuid);
      }
      const networkUUID =
        profile.selectedNetworkUUID || contextValue.activeNetwork?.uuid;
      const accounts = networkUUID
        ? await accountRepository.getAccountsByProfileId(
            profile.uuid,
            networkUUID,
          )
        : [];
      const keysets = await accountRepository.getKeysetsByProfileId(
        profile.uuid,
      );
      const keySources = await walletRepository.getProfileKeySources(
        profile.uuid,
      );
      keySourceManager.reset();
      if (networkUUID) {
        syncAllAccounts(profile.uuid, networkUUID);
      }
      const activeNetwork = networkUUID
        ? await networkRepository.getNetwork(networkUUID)
        : undefined;
      setContextValue((ctx) => ({
        ...ctx,
        profile,
        accounts,
        keySources,
        keysets,
        activeNetwork: activeNetwork ?? ctx.activeNetwork,
      }));
      return { profile, accounts, keySources };
    },
    [session],
  );

  const setActiveNetwork = useCallback(
    (activeNetwork: INetwork | undefined) => {
      setContextValue((ctx) => ({ ...ctx, activeNetwork }));
      if (contextValue.profile?.uuid && activeNetwork?.uuid) {
        walletRepository.patchProfile(contextValue.profile.uuid, {
          selectedNetworkUUID: activeNetwork.uuid,
        });
      }
    },
    [contextValue.profile?.uuid],
  );

  useEffect(() => {
    const loadSession = async () => {
      if (!session.isLoaded()) return;
      const profileId = (await session.get('profileId')) as string | undefined;
      if (profileId) {
        const profile = await walletRepository.getProfile(profileId);
        await setProfile(profile, true);
      }
      setContextValue((ctx) => ({ ...ctx, loaded: true }));
      globalThis.dispatchEvent(new CustomEvent('wallet-loaded'));
    };
    loadSession();
  }, [retrieveProfileList, session, setProfile]);

  useEffect(() => {
    retrieveProfileList();
  }, [retrieveProfileList]);

  useEffect(() => {
    retrieveFungibles();
  }, [retrieveFungibles]);

  useEffect(() => {
    retrieveNetworks();
  }, [retrieveNetworks]);

  useEffect(() => {
    retrieveContacts();
  }, [retrieveContacts]);

  const syncAllAccountsCb = useCallback(
    (force: boolean = false) => {
      if (contextValue.profile?.uuid && contextValue.activeNetwork?.uuid) {
        if (force) {
          // without throttling
          AccountService.syncAllAccounts(
            contextValue.profile?.uuid,
            contextValue.activeNetwork?.uuid,
          );
        } else {
          syncAllAccounts(
            contextValue.profile?.uuid,
            contextValue.activeNetwork?.uuid,
          );
        }
      }
    },
    [contextValue.profile?.uuid, contextValue.activeNetwork?.uuid],
  );

  useEffect(() => {
    syncAllAccountsCb();
  }, [syncAllAccountsCb]);

  useEffect(() => {
    if (contextValue.profile?.uuid) {
      console.log('retrieving accounts');
      retrieveAccounts(contextValue.profile.uuid);
    }
  }, [retrieveAccounts, contextValue.profile?.uuid]);

  useEffect(() => {
    // filter network if the id is the same but the uuid is different
    // e.g. multiple devnets
    const filteredNetworks = contextValue.networks.filter((network) => {
      if (!contextValue.activeNetwork) return true;
      return (
        network.networkId !== contextValue.activeNetwork.networkId ||
        network.uuid === contextValue.activeNetwork.uuid
      );
    });
    const getHostUrl = hostUrlGenerator(filteredNetworks);

    networkHostFunctionRef.current = getHostUrl;

    setGlobalConfig({
      host: getHostUrl,
      defaults: {
        meta: { chainId: '0' },
        networkId: contextValue.activeNetwork?.networkId,
      },
    });
    setContextValue((ctx) => ({ ...ctx, client: createClient(getHostUrl) }));
    console.log('networks changed', contextValue.activeNetwork);
  }, [contextValue.networks, contextValue.activeNetwork]);

  return (
    <WalletContext.Provider
      value={[
        contextValue,
        setProfile,
        setActiveNetwork,
        syncAllAccountsCb,
        askForPassword,
      ]}
    >
      {contextValue.loaded ? children : 'Loading wallet...'}
    </WalletContext.Provider>
  );
};
