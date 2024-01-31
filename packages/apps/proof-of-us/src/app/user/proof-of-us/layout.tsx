'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const { proofOfUs, isLoading, error } = useProofOfUs();

  if (isLoading) return <IsLoading />;
  if (error) return <div>{error.message}</div>;
  if (!proofOfUs) {
    router.replace('/404');
    return null;
  }

  return <>{children}</>;
};

export default UserLayout;
