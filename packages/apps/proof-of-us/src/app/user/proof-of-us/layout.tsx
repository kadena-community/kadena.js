'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { useProofOfUs } from '@/hooks/proofOfUs';
import Link from 'next/link';
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

  return (
    <>
      <ul>
        <li>
          <Link href={`/user/proof-of-us/${proofOfUs.tokenId}`}>
            Proof Of Us
          </Link>
        </li>
        <li>
          <Link href={`/user/proof-of-us/${proofOfUs.tokenId}/analytics`}>
            analytics
          </Link>
        </li>
      </ul>
      {children}
    </>
  );
};

export default UserLayout;
