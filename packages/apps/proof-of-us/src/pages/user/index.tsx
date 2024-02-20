'use client';
import type { Token } from '@/__generated__/sdk';
import { Button } from '@/components/Button/Button';
import { IconButton } from '@/components/IconButton/IconButton';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useAccount } from '@/hooks/account';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { centerClass, emptyListLinkClass } from '@/styles/global.css';
import { MonoLogout } from '@kadena/react-icons';
import { Stack, SystemIcon } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
      <Stack display="flex" flexDirection="column" width="100%">
        <TitleHeader
          label="Dashboard"
          Append={() => (
            <IconButton onClick={logout}>
              <MonoLogout />
            </IconButton>
          )}
        />
        <Stack>
          {!isLoading &&
            !error &&
            (data.length === 0 ? (
              <div className={centerClass}>
                <Link
                  className={emptyListLinkClass}
                  href="/user/proof-of-us/new"
                >
                  <SystemIcon.Plus size="lg" /> Add your first connection
                </Link>
              </div>
            ) : (
              <>
                <Stack
                  display="flex"
                  flexDirection="column"
                  gap="md"
                  width="100%"
                >
                  <div>Proofs ({data.length})</div>
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
