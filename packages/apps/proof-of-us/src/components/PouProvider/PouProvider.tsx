'use client';
import { useGetPou } from '@/hooks/getPou';
import { useParams, useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext } from 'react';
import { IsLoading } from '../IsLoading/IsLoading';

export interface IPouContext {
  data?: IPou;
}

export const PouContext = createContext<IPouContext>({
  data: undefined,
});

export const PouProvider: FC<PropsWithChildren> = ({ children }) => {
  const params = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useGetPou({ id: params.id });

  if (isLoading) return <IsLoading />;
  if (error) return <div>{error.message}</div>;
  if (!data) {
    router.replace('/404');
    return null;
  }

  return <PouContext.Provider value={{ data }}>{children}</PouContext.Provider>;
};
