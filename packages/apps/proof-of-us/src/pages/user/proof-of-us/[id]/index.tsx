import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
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
        <CreateProofOfUs params={params} />
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
