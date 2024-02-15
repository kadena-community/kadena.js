'use client';

import { ConnectView } from '@/features/ConnectView/ConnectView';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { proofOfUs, background, addSignee } = useProofOfUs();

  useEffect(() => {
    if (!proofOfUs) return;

    addSignee();
  }, [proofOfUs, addSignee]);

  if (!proofOfUs) return null;

  return (
    <div>
      <ConnectView proofOfUs={proofOfUs} background={background} />
    </div>
  );
};

export default Page;
