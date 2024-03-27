'use client';
import { Button } from '@/components/Button/Button';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/react-ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';

const Page: FC = () => {
  const { account, isMounted, login } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isMounted || !account) return;
    router.push('/user');
  }, [isMounted, account]);

  if (!isMounted) return null;

  return (
    <ScreenHeight>
      <Stack flex={1} width="100%" justifyContent="center" alignItems="center">
        <Image
          src="/assets/logo.svg"
          alt="Proof of Us (Powered by Kandena)"
          width="241"
          height="117"
        />
      </Stack>

      <Button variant="primary" onPress={login}>
        Connect
      </Button>
    </ScreenHeight>
  );
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: `/scan/e/${process.env.NEXT_PUBLIC_CONNECTION_EVENTID}`,
    },
  };
};

export default Page;
