'use client';

import { Multi } from '@/features/Multi/Multi';
import { useProofOfUs } from '@/hooks/proofOfUs';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { proofOfUs } = useProofOfUs();

  console.log({ proofOfUs });

  if (!proofOfUs) return null;

  return (
    <div>
      <Multi proofOfUs={proofOfUs} />
    </div>
  );
};

export default Page;
