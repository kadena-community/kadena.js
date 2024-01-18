'use client';

import { useProofOfUs } from '@/hooks/proofOfUs';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { data } = useProofOfUs();

  if (!data) return null;

  return (
    <div>
      <h2>Analytics</h2>
      Proof Of Us with ID ({data.id})
    </div>
  );
};

export default Page;
