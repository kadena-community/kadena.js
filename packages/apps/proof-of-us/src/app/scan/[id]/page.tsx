'use client';

import { Mint } from '@/components/Mint/Mint';
import { Scan } from '@/components/Scan/Scan';
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
      {proofOfUs.type === 'multi' && <Scan proofOfUs={proofOfUs} />}
      {proofOfUs.type === 'event' && <Mint proofOfUs={proofOfUs} />}
    </div>
  );
};

export default Page;
