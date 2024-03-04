import { ConnectView } from '@/components/ConnectView/ConnectView';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

export const ConnectPage: FC<IProps> = () => {
  const { proofOfUs, background, addSignee } = useProofOfUs();

  useEffect(() => {
    if (!proofOfUs) return;

    addSignee();
  }, [proofOfUs, addSignee]);

  if (!proofOfUs || proofOfUs.signees.length !== 2) return null;

  return <ConnectView proofOfUs={proofOfUs} background={background} />;
};
