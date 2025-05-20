'use client';

import { UserContext } from '@/contexts/UserContext/UserContext';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { User } from 'firebase/auth';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();
  const { addNotification } = useNotifications();

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
          label: 'Login issue',
          message: error.message,
        });
      });
  }, []);

  useEffect(() => {
    const { auth } = getProvider();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        console.log('login');
        setUser(user);
        // ...
      } else {
        router.push('/login');
        console.log('not loggedin');
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, signIn }}>
      {children}
    </UserContext.Provider>
  );
};
