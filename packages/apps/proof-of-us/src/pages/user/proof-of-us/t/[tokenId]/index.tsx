import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { MessageBlock } from '@/components/MessageBlock/MessageBlock';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import UserLayout from '@/components/UserLayout/UserLayout';
import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getTokenUri, getTransaction } from '@/utils/proofOfUs';
import { Stack } from '@kadena/react-ui';
import type { GetServerSidePropsContext, NextPage } from 'next';

interface IProps {
  params: {
    tokenId: string;
  };
  transaction?: any;
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}

const Page: NextPage<IProps> = ({ params, data, metadataUri, transaction }) => {
  return (
    <LoginBoundry>
      <UserLayout>
        {data && (
          <Share
            tokenId={params.tokenId}
            data={data}
            metadataUri={metadataUri}
          />
        )}
        {transaction?.result?.status === 'failure' && (
          <>
            <Stack
              padding="md"
              flexDirection="column"
              style={{
                maxWidth: '800px',
                width: '100%',
                marginInline: 'auto',
              }}
            >
              <MessageBlock variant="error" title="Something went wrong">
                {transaction?.result.error.message}
              </MessageBlock>
            </Stack>
            <pre>{JSON.stringify(transaction, null, 2)}</pre>
          </>
        )}
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const tokenId = `${ctx.query.tokenId}`;
  const requestKey = `${ctx.query.requestKey}`;

  const uri = await getTokenUri(tokenId);
  const data = await fetchManifestData(uri);
  const transaction = await getTransaction(requestKey);

  const response: IProps = {
    params: { tokenId: `${ctx.query.tokenId}` },
  };

  if (data) response.data = data;
  if (transaction && transaction[requestKey])
    response.transaction = transaction[requestKey];
  if (uri) response.metadataUri = uri;

  return {
    props: response,
  };
};

export default Page;
