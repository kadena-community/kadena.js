import UserLayout from '@/components/UserLayout/UserLayout';
import { Share } from '@/features/Share/Share';
import type { NextPage, NextPageContext } from 'next';

interface IProps {
  params: {
    id: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  return (
    <UserLayout>
      <Share eventId={params.id} />
    </UserLayout>
  );
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<IProps> => {
  return { params: { id: `${ctx.query.id}` } };
};

export default Page;
