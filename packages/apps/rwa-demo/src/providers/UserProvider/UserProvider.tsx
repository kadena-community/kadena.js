'use client';

import type { IUserData } from '@/contexts/UserContext/UserContext';
import { UserContext } from '@/contexts/UserContext/UserContext';
import { useOrganisation } from '@/hooks/organisation';
import { UserStore } from '@/utils/store/userStore';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { IdTokenResult, User } from 'firebase/auth';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as signOutFB,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IWalletAccount } from '../AccountProvider/AccountType';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<IdTokenResult | undefined>();
  const [userData, setUserData] = useState<IUserData | undefined>();
  const { organisation } = useOrganisation();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const userStore = useMemo(() => {
    if (!organisation || !user) return;
    return UserStore(organisation, user);
  }, [organisation, user]);

  useEffect(() => {
    if (!user || !organisation?.id) return;
    const unlisten = userStore?.listenToUser(setUserData);
    return unlisten;
  }, [user, organisation?.id]);

  const getProvider = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    const auth = getAuth();

    return { provider, auth };
  };

  const signIn = useCallback(() => {
    const { provider, auth } = getProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        // The signed-in user info.

        setUser(result.user);
      })
      .catch((error) => {
        addNotification({
          intent: 'negative',
          label: 'Signin issue',
          message: error.message,
        });
      });
  }, []);

  const signOut = () => {
    const { auth } = getProvider();
    signOutFB(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        addNotification({
          intent: 'negative',
          label: 'Signout issue',
          message: error.message,
        });
      });
  };

  const refreshToken = useCallback(
    async (user: User) => {
      const tokenResult = await user?.getIdTokenResult(true);
      setToken(tokenResult);
      return tokenResult;
    },
    [user, setToken],
  );

  useEffect(() => {
    const { auth } = getProvider();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        setUser(user);
        await refreshToken(user);
      } else {
        setUser(undefined);
        setToken(undefined);
        router.push('/login');
      }
    });
  }, []);

  useEffect(() => {
    console.log({ token });
    if (user?.uid && token?.token && organisation) {
      if (
        !token.claims.allowedOrgs ||
        !(token.claims.allowedOrgs as Record<string, boolean>)[organisation.id]
      ) {
        console.log('notallowed');
        setIsMounted(false);
        router.push('/404');
        return;
      }

      console.log('allowed');
      setIsMounted(true);
    } else {
      setIsMounted(false);
    }
  }, [user, token, organisation]);

  const addAccount = useCallback(
    async (wallet: IWalletAccount) => {
      if (!user || !organisation) return;
      await userStore?.addAccountAddress(wallet);
    },
    [user, organisation, userStore],
  );

  const removeAccount = useCallback(
    async (address: string) => {
      if (!user || !organisation) return;
      await userStore?.removeAccountAddress(address);
    },
    [user, organisation, userStore],
  );

  console.log({ token });
  return (
    <UserContext.Provider
      value={{
        user,
        userToken: token,
        userData,
        isMounted,
        signIn,
        signOut,
        addAccount,
        removeAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
