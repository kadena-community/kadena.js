import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import UserLayout from '@/components/UserLayout/UserLayout';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getTokenUri } from '@/utils/proofOfUs';
import type { GetServerSidePropsContext, NextPage } from 'next';

interface IProps {
  params: {
    tokenId: string;
  };
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}

const Page: NextPage<IProps> = ({ params, data, metadataUri }) => {
  return (
    <LoginBoundry>
      <UserLayout>
        <ProofOfUsProvider>
          <Share
            tokenId={params.tokenId}
            data={data}
            metadataUri={metadataUri}
          />
        </ProofOfUsProvider>
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const tokenId = `${ctx.query.tokenId}`;

  console.log({ tokenId });
  const uri = await getTokenUri(tokenId);
  console.log({ uri });
  const data = await fetchManifestData(uri);
  console.log({ data });

  return {
    props: {
      params: { tokenId: `${ctx.query.tokenId}` },
      data,
      metadataUri: uri,
    },
  };
};

export default Page;
