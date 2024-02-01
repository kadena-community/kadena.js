'use client';

import { Mint } from '@/components/Mint/Mint';
import { Scan } from '@/components/Scan/Scan';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSocket } from '@/hooks/socket';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const { connect } = useSocket();
  const { proofOfUs } = useProofOfUs();

  useEffect(() => {
    connect({ tokenId: params.id });
  }, []);

  if (!proofOfUs) return null;

  return (
    <div>
      {proofOfUs.type === 'multi' && <Scan proofOfUs={proofOfUs} />}
      {proofOfUs.type === 'event' && <Mint proofOfUs={proofOfUs} />}
    </div>
  );
};

export default Page;
