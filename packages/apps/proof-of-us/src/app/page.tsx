'use client';
import { Button } from '@/components/Button/Button';
import { useAccount } from '@/hooks/account';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { MyTokens } from './MyTokens';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new YogaLink({
    endpoint: '/graph',
  }),
  cache: new InMemoryCache(),
});

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
    >
      <Button variant="primary" onPress={login}>
        Login
      </Button>
      <ApolloProvider client={client}>
        <MyTokens></MyTokens>
      </ApolloProvider>
    </Stack>
  );
};

export default Page;
