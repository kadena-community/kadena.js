import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
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
  metadataUri?: string;
}

const Page: NextPage<IProps> = ({ params, data, metadataUri }) => {
  return (
    <LoginBoundry>
      <UserLayout>
        <Share tokenId={params.id} data={data} metadataUri={metadataUri} />
      </UserLayout>
    </LoginBoundry>
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
