import { Button } from '@/components/Button/Button';
import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { ErrorStatus } from '@/components/Status/ErrorStatus';
import { LoadingStatus } from '@/components/Status/LoadingStatus';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useListen } from '@/hooks/listen';
import { SubmitStatus } from '@/hooks/submit';
import { Stack } from '@kadena/react-ui';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
    requestKey: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  const { listen, status, result } = useListen();
  const router = useRouter();

  const init = async () => {
    try {
      //TODO: use listener from the tokenprovider
      await listen(params.requestKey);
    } catch (e) {}
  };

  useEffect(() => {
    init();
  }, []);

  if (status === SubmitStatus.SUCCESS) {
    router.replace(`/user/proof-of-us/t/${params.id}`);
    return;
  }

  return (
    <LoginBoundry>
      <UserLayout>
        <ProofOfUsProvider>
          <ScreenHeight>
            {status !== SubmitStatus.ERROR && (
              <Stack flex={1} flexDirection="column">
                <LoadingStatus />
                <Stack flex={1} />
                <Stack>
                  <Link href="/user">
                    <Button>Go to dashboard</Button>
                  </Link>
                </Stack>
              </Stack>
            )}
            {status === SubmitStatus.ERROR && (
              <Stack
                flex={1}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <ErrorStatus>{JSON.stringify(result, null, 2)}</ErrorStatus>
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
  const id = `${ctx.query.id}`;
  const requestKey = `${ctx.query.requestkey}`;

  return {
    props: { params: { id, requestKey } },
  };
};

export default Page;
