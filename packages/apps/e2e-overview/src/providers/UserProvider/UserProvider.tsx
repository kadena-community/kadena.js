'use client';

import type { IUserContext } from '@/context/UserContext/UserContext';
import { UserContext } from '@/context/UserContext/UserContext';
import { supabaseClient } from '@/utils/db/createClient';
import type { User } from '@supabase/supabase-js';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userData, setUserData] = useState<
    IUserContext['userData'] | undefined
  >(undefined);
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

      const result = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
      setUserData(result.data ?? undefined);
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
