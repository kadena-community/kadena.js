import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
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
    <LoginBoundry>
      <UserLayout>
        <ProofOfUsProvider>
          <CreateProofOfUs params={params} />
        </ProofOfUsProvider>
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: NextPageContext,
): Promise<{ props: IProps }> => {
  return { props: { params: { id: `${ctx.query.id}` } } };
};

export default Page;
