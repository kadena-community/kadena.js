import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getProofOfUs } from '@/utils/proofOfUs';
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
    <>
      <ProofOfUsProvider>
        <Share eventId={params.id} token={token} proofOfUs={proofOfUs} />;
      </ProofOfUsProvider>
    </>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const id = `${ctx.query.id}`;

  const token = await getProofOfUs(id);
  const data = await fetchManifestData(token?.uri);

  const startDate = token && token['starts-at'].int;
  const endDate = token && token['ends-at'].int;
  const newData = data ? { ...data, startDate, endDate } : undefined;

  return {
    props: { params: { id: `${ctx.query.id}` }, token, proofOfUs: newData },
  };
};

export default Page;
