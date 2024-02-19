import UserLayout from '@/components/UserLayout/UserLayout';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getTokenUri } from '@/utils/proofOfUs';
import type { GetServerSidePropsContext, NextPage } from 'next';

interface IProps {
  params: {
    id: string;
  };
  token?: IProofOfUsToken;
  proofOfUs?: IProofOfUsTokenMeta;
}

const Page: NextPage<IProps> = ({ params, token, proofOfUs }) => {
  return (
    <UserLayout>
      <Share eventId={params.id} token={token} proofOfUs={proofOfUs} />
    </UserLayout>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const id = `${ctx.query.id}`;

  const uri = await getTokenUri(id);
  const data = await fetchManifestData(uri);
  const newData = data ? { ...data } : undefined;
  return {
    props: { params: { id: `${ctx.query.id}` }, proofOfUs: newData },
  };
};

export default Page;
