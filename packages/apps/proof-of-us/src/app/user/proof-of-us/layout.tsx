'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { ProofOfUsContext } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { useGetProofOfUs } from '@/hooks/getProofOfUs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  const params = useParams();
  const router = useRouter();

  console.log({ params });
  const { data, isLoading, error } = useGetProofOfUs({ id: params.id });

  if (isLoading) return <IsLoading />;
  if (error) return <div>{error.message}</div>;
  if (!data) {
    router.replace('/404');
    return null;
  }

  return (
    <ProofOfUsContext.Provider value={{ data }}>
      <ul>
        <li>
          <Link href={`/user/proof-of-us/${data.id}`}>Proof Of Us</Link>
        </li>
        <li>
          <Link href={`/user/proof-of-us/${data.id}/analytics`}>analytics</Link>
        </li>
      </ul>

      {children}
    </ProofOfUsContext.Provider>
  );
};

export default UserLayout;
