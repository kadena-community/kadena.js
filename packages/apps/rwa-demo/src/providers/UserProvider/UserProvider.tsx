'use client';

import type { IUserData } from '@/contexts/UserContext/UserContext';
import { UserContext } from '@/contexts/UserContext/UserContext';
import { useOrganisation } from '@/hooks/organisation';
import { userStore } from '@/utils/store/userStore';
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
import { useCallback, useEffect, useState } from 'react';
import type { IWalletAccount } from '../AccountProvider/AccountType';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<IdTokenResult | undefined>();
  const [userData, setUserData] = useState<IUserData | undefined>();
  const { organisation } = useOrganisation();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const init = async (user: User) => {
    if (!organisation?.id) return;
    await userStore.listenToUser(organisation.id, user.uid, setUserData);
  };

  useEffect(() => {
    if (!user || !organisation?.id) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(user);
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

  const addClaim = useCallback(async () => {
    try {
      const data = await fetch('/api/admin/claims', {
        method: 'POST',
        body: JSON.stringify({
          uid: user?.uid,
        }),
        headers: {
          Authorization: `Bearer ${token?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (data.status !== 200) {
        addNotification({
          intent: 'negative',
          label: 'claim issue',
          message: data.statusText,
        });
        return;
      }

      await refreshToken(user!);
    } catch (error) {
      addNotification({
        intent: 'negative',
        label: 'claim issue',
        message: error.message,
      });
    }
  }, [user, token, refreshToken]);

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
    if (user?.uid && token?.token) {
      setIsMounted(true);
    } else {
      setIsMounted(false);
    }
  }, [user, token]);

  const addAccount = useCallback(
    async (wallet: IWalletAccount) => {
      if (!user || !organisation) return;
      await userStore.addAccountAddress(user, organisation, wallet);
    },
    [user, organisation],
  );

  const removeAccount = useCallback(
    async (address: string) => {
      if (!user || !organisation) return;
      await userStore.removeAccountAddress(user, organisation, address);
    },
    [user, organisation],
  );

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
        addClaim,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
