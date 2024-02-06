'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import Link from 'next/link';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();

  return (
    <div>
      <h2>List of your Proof Of Us</h2>
      {isLoading && <IsLoading />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <ul>
          {data.map(({ token }) => {
            if (!token) return null;
            return (
              <li key={token.tokenId}>
                <Link href={`/user/proof-of-us/t/${token.tokenId}`}>
                  {new Date(token.date).toLocaleDateString()}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/user/proof-of-us/new">New Proof</Link>
    </div>
  );
};

export default Page;
