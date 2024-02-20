'use client';
import { Button } from '@/components/Button/Button';
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
  }, [isMounted]);

  return (
    <Stack
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap="xl"
      paddingInline="md"
    >
      <Stack flex="1" alignItems="center">
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
    </Stack>
  );
};

export default Page;
