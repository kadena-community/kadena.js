'use client';

import { UserContext } from '@/context/UserContext/UserContext';
import { useGetUser } from '@/hooks/getUser';

import { supabaseClient } from '@/utils/db/createClient';
import type { User } from '@supabase/supabase-js';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { data: userData } = useGetUser(user);

  const [isMounted, setIsMounted] = useState(false);
  const signInByGoogle = useCallback(async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  }, []);

  const signInByEmail = useCallback(
    async (data: { email: string; password: string }) => {},
    [],
  );

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data } = await supabaseClient.auth.getUser();

      setUser(data.user ?? undefined);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? undefined);
        setIsMounted(true);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut();
    setUser(undefined);
  }, []);

  console.log({ user });
  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        isMounted,
        signInByGoogle,
        signInByEmail,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
