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
    requestKey: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  console.log({ params });
  const { tokens, getToken } = useTokens();
  const [error, setError] = useState();
  const [token, setToken] = useState<IToken>();
  const router = useRouter();

  const init = async () => {
    if (!token) return;
    try {
      const result = await token?.listener;

      const transaction = result[params.requestKey];
      if (!transaction) return;

      router.replace(
        `/user/proof-of-us/t/${transaction.result.data}?requestKey=${params.requestKey}`,
      );
    } catch (e) {
      console.log('fail on the page');
      setError(e);
    }
  };

  useEffect(() => {
    const result = getToken(params.requestKey);
    if (!result) return;
    setToken(result);
  }, [params.requestKey, tokens]);

  useEffect(() => {
    init();
  }, [token]);

  return (
    <LoginBoundry>
      <UserLayout>
        <ProofOfUsProvider proofOfUsId={token?.proofOfUsId}>
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
  const requestKey = `${ctx.query.requestKey}`;

  return {
    props: { params: { requestKey } },
  };
};

export default Page;
