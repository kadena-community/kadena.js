'use client';

import { Event } from '@/features/Event/Event';
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

  if (!proofOfUs) return null;

  return (
    <div>
      {proofOfUs.type === 'multi' && <Multi proofOfUs={proofOfUs} />}
      {proofOfUs.type === 'event' && <Event proofOfUs={proofOfUs} />}
    </div>
  );
};

export default Page;
