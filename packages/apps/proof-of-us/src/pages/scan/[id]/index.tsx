import { ConnectView } from '@/components/ConnectView/ConnectView';
import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import UserLayout from '@/components/UserLayout/UserLayout';
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
          <ConnectView params={params} />
        </ProofOfUsProvider>
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: NextPageContext,
): Promise<{ props: IProps }> => {
  return {
    props: {
      params: { id: `${ctx.query.id}` },
    },
  };
};

export default Page;
