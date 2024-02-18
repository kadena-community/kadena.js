import ScanLayout from '@/components/ScanLayout/ScanLayout';
import { ConnectView } from '@/features/ConnectView/ConnectView';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { NextPage, NextPageContext } from 'next';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: NextPage<IProps> = () => {
  const { proofOfUs, background, addSignee } = useProofOfUs();

  useEffect(() => {
    if (!proofOfUs) return;

    addSignee();
  }, [proofOfUs, addSignee]);

  if (!proofOfUs) return null;

  return (
    <ScanLayout>
      <div>
        <ConnectView proofOfUs={proofOfUs} background={background} />
      </div>
    </ScanLayout>
  );
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<IProps> => {
  return {
    params: { id: `${ctx.query.id}` },
  };
};

export default Page;
