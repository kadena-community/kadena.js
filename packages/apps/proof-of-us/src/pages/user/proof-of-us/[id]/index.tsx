import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import UserLayout from '@/components/UserLayout/UserLayout';
import { CreateProofOfUs } from '@/features/CreateProofOfUs/CreateProofOfUs';
import type { NextPage, NextPageContext } from 'next';

interface IProps {
  params: {
    id: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  return (
    <UserLayout>
      <ProofOfUsProvider>
        <CreateProofOfUs params={params} />
      </ProofOfUsProvider>
    </UserLayout>
  );
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<IProps> => {
  return { params: { id: `${ctx.query.id}` } };
};

export default Page;
