import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { Share } from '@/features/Share/Share';
import type { NextPage, NextPageContext } from 'next';
interface IProps {
  params: {
    id: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  return (
    <ProofOfUsProvider>
      <Share eventId={params.id} />;
    </ProofOfUsProvider>
  );
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<IProps> => {
  return { params: { id: `${ctx.query.id}` } };
};

export default Page;
