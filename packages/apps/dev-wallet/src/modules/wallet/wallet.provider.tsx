import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { getSession } from '@/utils/session';
import { IAccount } from '../account/account.repository';
import * as AccountService from '../account/account.service';
import { dbService } from '../db/db.service';
import { keySourceManager } from '../key-source/key-source-manager';
import { IKeySource, IProfile, walletRepository } from './wallet.repository';
import * as WalletService from './wallet.service';

export type ExtWalletContextType = {
  profile?: IProfile;
  accounts?: IAccount[];
  profileList?: Pick<IProfile, 'name' | 'uuid' | 'accentColor'>[];
  keySources?: IKeySource[];
};

export const WalletContext = createContext<
  | [
      ExtWalletContextType,
      (profile: IProfile | undefined) => Promise<null | {
        profile: IProfile;
        accounts: IAccount[];
        keySources: IKeySource[];
      }>,
    ]
  | null
>(null);

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [contextValue, setContextValue] = useState<ExtWalletContextType>({});

  const retrieveProfileList = useCallback(async () => {
    const profileList = (await walletRepository.getAllProfiles()).map(
      ({ name, uuid, accentColor }) => ({
        name,
        uuid,
        accentColor,
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

  const retrieveAccounts = useCallback(async (profileId: string) => {
    const accounts = await WalletService.getAccounts(profileId);
    setContextValue((ctx) => ({
      ...ctx,
      accounts,
    }));
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

  const setProfile = async (
    profile: IProfile | undefined,
    noSession = false,
  ) => {
    if (!profile) {
      keySourceManager.reset();
      localStorage.clear();
      setContextValue(({ profileList }) => ({ profileList }));
      return null;
    }
    if (!noSession) {
      localStorage.clear();
      localStorage.setItem('profile', JSON.stringify(profile));
    }
    const accounts = await WalletService.getAccounts(profile.uuid);
    const keySources = await walletRepository.getProfileKeySources(
      profile.uuid,
    );
    keySourceManager.reset();
    AccountService.syncAllAccounts(profile.uuid);
    setContextValue(({ profileList }) => ({
      profileList,
      profile,
      accounts,
      keySources,
    }));
    return { profile, accounts, keySources };
  };

  const unlockKeySourcesFromSession = async (profileId: string) => {
    const loadService = async (type: 'HD-BIP44' | 'HD-chainweaver') => {
      const context = await getSession(`${profileId}-${type}`);
      if (context) {
        await keySourceManager.get(type, context);
      }
    };
    await Promise.all(
      (['HD-BIP44', 'HD-chainweaver'] as const).map(loadService),
    );
  };

  useEffect(() => {
    retrieveProfileList();
    const profile = JSON.parse(localStorage.getItem('profile') ?? 'null');
    if (profile) {
      console.log('retrieving profile from session', profile);
      setProfile(profile, true);
      unlockKeySourcesFromSession(profile.uuid);
    }
  }, [retrieveProfileList]);

  return (
    <WalletContext.Provider value={[contextValue, setProfile]}>
      {children}
    </WalletContext.Provider>
  );
};
