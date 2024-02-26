import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getTokenUri } from '@/utils/proofOfUs';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';

interface IProps {
  params: {
    id: string;
  };
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}

const Page: NextPage<IProps> = ({ params, data, metadataUri }) => {
  if (!data) return null;
  return (
    <>
      <Head>
        <title>{data.name} | Proof Of Us (Powered by Kadena)</title>
        <meta
          key="title"
          name="title"
          content={`${data.name} | Proof Of Us (Powered by Kadena)`}
        />
        <meta key="description" name="description" content={data.description} />
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`${data.name} | Proof Of Us (Powered by Kadena)`}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={data.description}
        />
        <meta
          key="og:title"
          property="og:title"
          content={`${data.name} | Proof Of Us (Powered by Kadena)`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={data.description}
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
        <meta key="twitter:image" name="twitter:image" content={data.image} />
        <meta key="og:image" property="og:image" content={data.image} />
      </Head>
      <Share tokenId={params.id} data={data} metadataUri={metadataUri} />
    </>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const id = `${ctx.query.id}`;

  const uri = await getTokenUri(id);
  const data = await fetchManifestData(uri);

  return {
    props: { params: { id: `${ctx.query.id}` }, data, metadataUri: uri },
  };
};

export default Page;
