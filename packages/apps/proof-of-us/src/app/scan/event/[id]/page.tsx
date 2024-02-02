'use client';

import { ScanEvent } from '@/features/ScanEvent/ScanEvent';
import { useProofOfUs } from '@/hooks/proofOfUs';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { proofOfUs } = useProofOfUs();

  if (!proofOfUs) return null;

  return (
    <div>
      <ScanEvent proofOfUs={proofOfUs} />
    </div>
  );
};

export default Page;
