'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { useGetAllProofOfUs } from '@/hooks/getAllProofOfUs';
import Link from 'next/link';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();
  return (
    <div>
      list of your Proof Of Us
      {isLoading && <IsLoading />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <ul>
          {data.map((proofOfUs) => (
            <li key={proofOfUs.id}>
              <Link href={`/user/proof-of-us/${proofOfUs.id}`}>
                {new Date(proofOfUs.date).toLocaleDateString()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
