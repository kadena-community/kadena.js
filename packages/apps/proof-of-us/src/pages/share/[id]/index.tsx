import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getProofOfUs } from '@/utils/proofOfUs';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';

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
      <Head>
        <title>{proofOfUs?.name} | Proof Of Us (Powered by Kadena)</title>
        <meta
          key="title"
          name="title"
          content={`${proofOfUs?.name} | Proof Of Us (Powered by Kadena)`}
        />
        <meta
          key="description"
          name="description"
          content={proofOfUs?.description}
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`${proofOfUs?.name} | Proof Of Us (Powered by Kadena)`}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={proofOfUs?.description}
        />
        <meta
          key="og:title"
          property="og:title"
          content={`${proofOfUs?.name} | Proof Of Us (Powered by Kadena)`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={proofOfUs?.description}
        />
        <meta
          key="twitter:url"
          name="twitter:url"
          content={`${process.env.NEXT_PUBLIC_URL}/share/${params.id}`}
        />
        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_URL}/share/${params.id}`}
        />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={proofOfUs?.image}
        />
        <meta key="og:image" property="og:image" content={proofOfUs?.image} />
      </Head>
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
