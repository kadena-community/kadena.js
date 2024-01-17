'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { PouContext } from '@/components/PouProvider/PouProvider';
import { useGetPou } from '@/hooks/getPou';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  const params = useParams();
  const router = useRouter();

  console.log({ params });
  const { data, isLoading, error } = useGetPou({ id: params.id });

  if (isLoading) return <IsLoading />;
  if (error) return <div>{error.message}</div>;
  if (!data) {
    router.replace('/404');
    return null;
  }

  return (
    <PouContext.Provider value={{ data }}>
      <ul>
        <li>
          <Link href={`/user/pous/${data.id}`}>pou</Link>
        </li>
        <li>
          <Link href={`/user/pous/${data.id}/analytics`}>analytics</Link>
        </li>
      </ul>

      {children}
    </PouContext.Provider>
  );
};

export default UserLayout;
