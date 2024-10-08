import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useSession } from '@/App/session';
import { throttle } from '@/utils/session';
import {
  Fungible,
  IAccount,
  IKeySet,
  accountRepository,
} from '../account/account.repository';
import * as AccountService from '../account/account.service';
import { dbService } from '../db/db.service';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork, networkRepository } from '../network/network.repository';
import { IKeySource, IProfile, walletRepository } from './wallet.repository';

export type ExtWalletContextType = {
  profile?: IProfile;
  accounts?: IAccount[];
  keysets?: IKeySet[];
  profileList?: Pick<IProfile, 'name' | 'uuid' | 'accentColor' | 'options'>[];
  keySources?: IKeySource[];
  fungibles?: Fungible[];
  loaded?: boolean;
  activeNetwork?: INetwork | undefined;
  networks: INetwork[];
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
      syncAllAccounts: () => void,
    ]
  | null
>(null);

export const syncAllAccounts = throttle(AccountService.syncAllAccounts, 10000);

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [contextValue, setContextValue] = useState<ExtWalletContextType>({
    networks: [],
  });
  const session = useSession();

  const retrieveNetworks = useCallback(async () => {
    const networks = (await networkRepository.getEnabledNetworkList()) ?? [];
    setContextValue((ctx) => ({
      ...ctx,
      networks,
      activeNetwork: ctx.activeNetwork ?? networks.find((n) => n.default),
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

  const retrieveAccounts = useCallback(
    async (profileId: string) => {
      if (!contextValue.activeNetwork?.networkId) {
        setContextValue((ctx) => ({
          ...ctx,
          accounts: [],
        }));
        return;
      }
      const accounts = await accountRepository.getAccountsByProfileId(
        profileId,
        contextValue.activeNetwork?.networkId,
      );
      setContextValue((ctx) => ({
        ...ctx,
        accounts,
      }));
    },
    [contextValue.activeNetwork?.networkId],
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
    const unsubscribe = dbService.subscribe((event, storeName, data) => {
      if (!['add', 'update', 'delete'].includes(event)) return;
      // update the context when the db changes
      switch (storeName) {
        case 'profile': {
          retrieveProfileList();
          break;
        }
        case 'fungible': {
          retrieveFungibles();
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
        case 'keyset':
          if (data && (data as IKeySet).profileId) {
            retrieveKeysets(data.profileId);
          }
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
  ]);

  const setProfile = useCallback(
    async (profile: IProfile | undefined, noSession = false) => {
      if (!profile) {
        keySourceManager.reset();
        session.clear();
        setContextValue((ctx) => ({
          ...ctx,
          profile: undefined,
          accounts: undefined,
          keySources: undefined,
        }));
        return null;
      }
      if (!noSession) {
        await session.reset();
      }
      const networkId = contextValue.activeNetwork?.networkId;
      await session.set('profileId', profile.uuid);
      const accounts = networkId
        ? await accountRepository.getAccountsByProfileId(
            profile.uuid,
            networkId,
          )
        : [];
      const keysets = await accountRepository.getKeysetsByProfileId(
        profile.uuid,
      );
      const keySources = await walletRepository.getProfileKeySources(
        profile.uuid,
      );
      keySourceManager.reset();
      if (networkId) {
        syncAllAccounts(profile.uuid, networkId);
      }
      setContextValue((ctx) => ({
        ...ctx,
        profile,
        accounts,
        keySources,
        keysets,
      }));
      return { profile, accounts, keySources };
    },
    [session],
  );

  const setActiveNetwork = useCallback(
    (activeNetwork: INetwork | undefined) => {
      setContextValue((ctx) => ({ ...ctx, activeNetwork }));
    },
    [],
  );

  useEffect(() => {
    const loadSession = async () => {
      if (!session.isLoaded()) return;
      const profileId = session.get('profileId') as string | undefined;
      if (profileId) {
        const profile = await walletRepository.getProfile(profileId);
        await setProfile(profile, true);
      }
      setContextValue((ctx) => ({ ...ctx, loaded: true }));
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

  const syncAllAccountsCb = useCallback(() => {
    if (contextValue.profile?.uuid && contextValue.activeNetwork?.networkId) {
      syncAllAccounts(
        contextValue.profile?.uuid,
        contextValue.activeNetwork?.networkId,
      );
    }
  }, [contextValue.profile?.uuid, contextValue.activeNetwork?.networkId]);

  useEffect(() => {
    syncAllAccountsCb();
  }, [syncAllAccountsCb]);

  useEffect(() => {
    if (contextValue.profile?.uuid) {
      console.log('retrieving accounts');
      retrieveAccounts(contextValue.profile.uuid);
    }
  }, [retrieveAccounts, contextValue.profile?.uuid]);

  return (
    <WalletContext.Provider
      value={[contextValue, setProfile, setActiveNetwork, syncAllAccountsCb]}
    >
      {contextValue.loaded ? children : 'Loading wallet...'}
    </WalletContext.Provider>
  );
};
