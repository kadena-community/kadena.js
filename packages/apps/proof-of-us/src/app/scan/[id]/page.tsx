'use client';

import { Multi } from '@/features/Multi/Multi';
import { ScanEvent } from '@/features/ScanEvent/ScanEvent';
import { useProofOfUs } from '@/hooks/proofOfUs';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { proofOfUs, background } = useProofOfUs();

  if (!proofOfUs) return null;

  return (
    <div>
      {proofOfUs.type === 'multi' && (
        <Multi proofOfUs={proofOfUs} background={background} />
      )}
      {proofOfUs.type === 'event' && <ScanEvent proofOfUs={proofOfUs} />}
    </div>
  );
};

export default Page;
