'use client';

import type { IUserData } from '@/contexts/UserContext/UserContext';
import { UserContext } from '@/contexts/UserContext/UserContext';
import { useOrganisation } from '@/hooks/organisation';
import { auth } from '@/utils/store/firebase';
import { UserStore } from '@/utils/store/userStore';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { IdTokenResult, User } from 'firebase/auth';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
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

  const handleSetUserData = (data: IUserData) => {
    setUserData(data);
  };

  useEffect(() => {
    if (!user?.uid || !organisation?.id) return;
    const unlisten = userStore?.listenToUser(handleSetUserData);
    return unlisten;
  }, [user?.uid, organisation?.id, userStore]);

  const getProvider = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    const auth = getAuth();

    return { provider, auth };
  };

  const signInByGoogle = useCallback(() => {
    const { provider, auth } = getProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
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

  const signInByEmail = useCallback(
    async (data: { email: string; password: string }) => {
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);
        })
        .catch((error) => {
          addNotification({
            intent: 'negative',
            label: 'Signin issue',
            message: error.message,
          });
        });
    },
    [],
  );

  const signOut = () => {
    const { auth } = getProvider();
    signOutFB(auth)
      .then(() => {
        setUser(undefined);
        setToken(undefined);
        setUserData(undefined);

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

    onIdTokenChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setIsMounted(true);
        setUser(undefined);
        setToken(undefined);
      }
    });

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        setUser(user);
        await refreshToken(user);
      } else {
        setIsMounted(true);
        setUser(undefined);
        setToken(undefined);
      }
    });
  }, []);

  useEffect(() => {
    console.log({ user, token, organisation });
    if (user?.uid && token?.token && organisation) {
      if (
        !token.claims.allowedOrgs ||
        !(token.claims.allowedOrgs as Record<string, boolean>)[organisation.id]
      ) {
        setIsMounted(false);
        console.log('404 - user not allowed in this organisation');
        router.push('/404');
        return;
      }
      setIsMounted(true);
    } else {
      setIsMounted(false);
    }
  }, [user, token, organisation]);

  const addAccount = useCallback(
    async (wallet: IWalletAccount) => {
      if (!userData || !organisation) return;
      await userStore?.addAccountAddress(wallet);
    },
    [userData, organisation, userStore],
  );

  const removeAccount = useCallback(
    async (address: string) => {
      if (!userData || !organisation) return;
      await userStore?.removeAccountAddress(address);
    },
    [userData, organisation, userStore],
  );

  const findAliasByAddress = (address?: string): string => {
    if (!address) return '';
    const aliases = userData?.aliases ?? {};
    return aliases[address]?.alias ?? '';
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userToken: token,
        userData,
        isMounted,
        signInByGoogle,
        signInByEmail,
        signOut,
        addAccount,
        removeAccount,
        userStore,
        findAliasByAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
