import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { CreateProofOfUs } from '@/features/CreateProofOfUs/CreateProofOfUs';
import type { NextPage, NextPageContext } from 'next';

interface IProps {
  params: {
    id: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  return (
    <ProofOfUsProvider>
      <CreateProofOfUs params={params} />
    </ProofOfUsProvider>
  );
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<IProps> => {
  return { params: { id: `${ctx.query.id}` } };
};

export default Page;
