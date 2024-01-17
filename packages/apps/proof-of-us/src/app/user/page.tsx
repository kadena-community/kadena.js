'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { useGetAllPous } from '@/hooks/getAllPous';
import Link from 'next/link';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllPous();
  return (
    <div>
      list of your pous
      {isLoading && <IsLoading />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <ul>
          {data.map((pou) => (
            <li key={pou.id}>
              <Link href={`/user/pous/${pou.id}`}>
                {new Date(pou.date).toLocaleDateString()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
