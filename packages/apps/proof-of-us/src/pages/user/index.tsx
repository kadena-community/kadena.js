'use client';
import { Button } from '@/components/Button/Button';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { IconButton } from '@/components/IconButton/IconButton';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { Text } from '@/components/Typography/Text';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useAccount } from '@/hooks/account';
import { useTokens } from '@/hooks/tokens';
import { secondaryTextClass } from '@/styles/global.css';
import { MonoGroup, MonoLogout } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

const Page: FC = () => {
  const { tokens, isLoading } = useTokens();
  const router = useRouter();
  const { logout } = useAccount();

  const handleNew = () => {
    router.push('/user/proof-of-us/new');
  };

  return (
    <LoginBoundry>
      <UserLayout>
        <ScreenHeight>
          {isLoading && <MainLoader />}

          {tokens && (
            <Stack flexDirection="column" flex={1} alignItems="center">
              <TitleHeader
                label="Dashboard"
                Append={() => (
                  <Confirmation
                    text="Are you sure you want to logout?"
                    action={logout}
                  >
                    <IconButton title="Logout">
                      <MonoLogout />
                    </IconButton>
                  </Confirmation>
                )}
              />
              <Stack flex={1} width="100%">
                {tokens.length === 0 ? (
                  <Stack
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
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
                  <Stack flexDirection="column" flex={1} gap="md">
                    <Stack
                      display="flex"
                      flexDirection="column"
                      gap="md"
                      width="100%"
                      style={{
                        flex: '1 1 0',
                        overflowY: 'scroll',
                      }}
                    >
                      <Text bold>Proofs ({tokens.length})</Text>
                      <List>
                        {tokens.map((token: IToken) => {
                          return (
                            <ListItem key={`${token.tokenId}`} token={token} />
                          );
                        })}
                      </List>
                    </Stack>
                    <Button onPress={handleNew}>Create Proof</Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}
        </ScreenHeight>
      </UserLayout>
    </LoginBoundry>
  );
};

export default Page;
