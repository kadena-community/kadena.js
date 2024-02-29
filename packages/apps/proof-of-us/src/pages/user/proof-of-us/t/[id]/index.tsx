import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import UserLayout from '@/components/UserLayout/UserLayout';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getImageString } from '@/utils/getImageString';
import { getTokenUri } from '@/utils/proofOfUs';

import type { GetServerSidePropsContext, NextPage } from 'next';

interface IProps {
  params: {
    id: string;
  };
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
  imageString: string;
}

const Page: NextPage<IProps> = ({ params, data, metadataUri, imageString }) => {
  return (
    <LoginBoundry>
      <UserLayout>
        <Share
          tokenId={params.id}
          data={data}
          metadataUri={metadataUri}
          image={imageString}
        />
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

  //image
  const base64_body = await getImageString(data?.image);

  return {
    props: {
      params: { id: `${ctx.query.id}` },
      data,
      metadataUri: uri,
      imageString: base64_body,
    },
  };
};

export default Page;
