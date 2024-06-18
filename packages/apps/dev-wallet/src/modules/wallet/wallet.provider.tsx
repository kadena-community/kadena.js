import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useSession } from '@/App/session';
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
  const session = useSession();

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

  const setProfile = useCallback(
    async (profile: IProfile | undefined, noSession = false) => {
      if (!profile) {
        keySourceManager.reset();
        session.clear();
        setContextValue(({ profileList }) => ({ profileList }));
        return null;
      }
      if (!noSession) {
        await session.createSession();
      }
      await session.set('profileId', profile.uuid);
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
    },
    [session],
  );

  useEffect(() => {
    const loadSession = async () => {
      if (!session.isLoaded) return;
      const profileId = session.get('profileId') as string | undefined;
      if (profileId) {
        const profile = await walletRepository.getProfile(profileId);
        console.log('retrieving profile from session', profile);
        // Note: this only loads the profile but the keySources are still locked.
        // So the user needs to enter the password if they need to sign a Tx
        // or create new keys, this is for security reasons;
        // I don't want to store the password or the keySource context in the session
        setProfile(profile, true);
      }
    };
    loadSession();
  }, [retrieveProfileList, session, setProfile]);

  useEffect(() => {
    retrieveProfileList();
  });

  return (
    <WalletContext.Provider value={[contextValue, setProfile]}>
      {children}
    </WalletContext.Provider>
  );
};
