import { Button } from '@/components/Button/Button';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { ErrorStatus } from '@/components/Status/ErrorStatus';
import { LoadingStatus } from '@/components/Status/LoadingStatus';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useTokens } from '@/hooks/tokens';
import { Stack } from '@kadena/react-ui';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    tokenId: string;
    requestKey: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  const { getToken } = useTokens();
  const [error, setError] = useState();
  const [token, setToken] = useState<IToken>();
  const router = useRouter();

  const init = async () => {
    if (!token) return;

    try {
      const result = await token?.listener;
      console.log({ result });

      router.replace(`/user/proof-of-us/t/${params.tokenId}`);
    } catch (e) {
      console.log('fail on the page');
      setError(e);
    }
    //TODO: use listener from the tokenprovider
  };

  useEffect(() => {
    const result = getToken(params.requestKey);
    if (!result) return;
    setToken(result);
  }, []);

  useEffect(() => {
    init();
  }, [token]);

  return (
    <LoginBoundry>
      <UserLayout>
        <ProofOfUsProvider>
          <ScreenHeight>
            {error ? (
              <Stack
                flex={1}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <ErrorStatus closeUrl="/user">
                  {JSON.stringify(error, null, 2)}
                </ErrorStatus>
              </Stack>
            ) : (
              <Stack flex={1} flexDirection="column">
                <LoadingStatus />
                <ListSignees />
                <Stack flex={1} />
                <Stack>
                  <Link href="/user">
                    <Button>Go to dashboard</Button>
                  </Link>
                </Stack>
              </Stack>
            )}
          </ScreenHeight>
        </ProofOfUsProvider>
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const tokenId = `${ctx.query.tokenId}`;
  const requestKey = `${ctx.query.requestkey}`;

  return {
    props: { params: { tokenId, requestKey } },
  };
};

export default Page;
