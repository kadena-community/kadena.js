'use client';
import { useGetProofOfUs } from '@/hooks/getProofOfUs';
import { useParams, useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext } from 'react';
import { IsLoading } from '../IsLoading/IsLoading';

export interface IProofOfUsContext {
  data?: IProofOfUs;
}

export const ProofOfUsContext = createContext<IProofOfUsContext>({
  data: undefined,
});

export const ProofOfUsProvider: FC<PropsWithChildren> = ({ children }) => {
  const params = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useGetProofOfUs({ id: params.id });

  if (isLoading) return <IsLoading />;
  if (error) return <div>{error.message}</div>;
  if (!data) {
    router.replace('/404');
    return null;
  }

  return (
    <ProofOfUsContext.Provider value={{ data }}>
      {children}
    </ProofOfUsContext.Provider>
  );
};
