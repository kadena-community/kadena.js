import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import ScanLayout from '@/components/ScanLayout/ScanLayout';
import { ConnectPage } from '@/features/ConnectPage/ConnectPage';
import type { NextPage, NextPageContext } from 'next';

interface IProps {
  params: {
    id: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  return (
    <ProofOfUsProvider>
      <ScanLayout>
        <ConnectPage params={params} />
      </ScanLayout>
    </ProofOfUsProvider>
  );
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<IProps> => {
  return {
    params: { id: `${ctx.query.id}` },
  };
};

export default Page;
