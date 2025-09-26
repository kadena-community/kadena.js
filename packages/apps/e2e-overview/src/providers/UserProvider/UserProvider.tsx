'use client';

import { UserContext } from '@/context/UserContext/UserContext';
import { createClient } from '@/utils/db/createClient';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const signInByGoogle = useCallback(async () => {
    const result = await createClient().auth.signInWithOAuth({
      provider: 'google',
    });

    console.log({ result });
  }, []);

  const signInByEmail = useCallback(
    async (data: { email: string; password: string }) => {},
    [],
  );

  const signOut = useCallback(() => {}, []);

  return (
    <UserContext.Provider
      value={{
        signInByGoogle,
        signInByEmail,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
