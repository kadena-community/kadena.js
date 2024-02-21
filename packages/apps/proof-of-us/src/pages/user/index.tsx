'use client';
import type { Token } from '@/__generated__/sdk';
import { Button } from '@/components/Button/Button';
import { IconButton } from '@/components/IconButton/IconButton';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { Text } from '@/components/Typography/Text';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useAccount } from '@/hooks/account';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { secondaryTextClass } from '@/styles/global.css';
import { MonoGroup, MonoLogout } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();
  const router = useRouter();
  const { logout } = useAccount();

  const handleNew = () => {
    router.push('/user/proof-of-us/new');
  };

  return (
    <UserLayout>
      {isLoading && <MainLoader />}
      {error && <div>{error.message}</div>}

      <Stack
        style={{ height: '90dvh' }}
        paddingInline="md"
        flexDirection="column"
      >
        <TitleHeader
          label="Dashboard"
          Append={() => (
            <IconButton onClick={logout}>
              <MonoLogout />
            </IconButton>
          )}
        />
        <Stack flex={1}>
          {!isLoading &&
            !error &&
            (data.length === 0 ? (
              <Stack
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <MonoGroup fontSize="8rem" />
                <Text bold>Create Your First Proof</Text>

                <p className={secondaryTextClass}>
                  Welcome to the &quot;Proof Of Us&quot; dApp.
                  <br />
                  With this tool, you can make your moments immutable.
                  <br />
                  <Link
                    style={{ fontWeight: 'bold' }}
                    href="/user/proof-of-us/new"
                  >
                    Go check it out!
                  </Link>
                </p>
              </Stack>
            ) : (
              <>
                <Stack
                  display="flex"
                  flexDirection="column"
                  gap="md"
                  width="100%"
                >
                  <Text bold>Proofs ({data.length})</Text>
                  <List>
                    {data.map((token: Token) => (
                      <ListItem key={token.id} token={token} />
                    ))}
                  </List>
                  <Button onPress={handleNew}>Create Proof</Button>
                </Stack>
              </>
            ))}
        </Stack>
      </Stack>
    </UserLayout>
  );
};

export default Page;
