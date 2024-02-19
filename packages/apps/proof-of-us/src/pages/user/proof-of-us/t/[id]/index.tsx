import UserLayout from '@/components/UserLayout/UserLayout';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getTokenUri } from '@/utils/proofOfUs';
import type { GetServerSidePropsContext, NextPage } from 'next';

interface IProps {
  params: {
    id: string;
  };
  data?: IProofOfUsTokenMeta;
}

const Page: NextPage<IProps> = ({ params, data }) => {
  return (
    <UserLayout>
      <Share tokenId={params.id} data={data} />
    </UserLayout>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const id = `${ctx.query.id}`;

  const uri = await getTokenUri(id);
  const data = await fetchManifestData(uri);
  return {
    props: { params: { id: `${ctx.query.id}` }, data },
  };
};

export default Page;
