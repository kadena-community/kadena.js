'use client';
import { ChainweaverWalletConnect } from '@/components/ChainweaverWalletConnect/ChainweaverWalletConnect';
import { EckoWalletConnect } from '@/components/EckoWalletConnect/EckoWalletConnect';
import { MagicConnect } from '@/components/MagicConnect/MagicConnect';
import { useAccount } from '@/hooks/account';
import { MonoKeyboardArrowDown } from '@kadena/kode-icons';
import { Button, ContextMenu, maskValue, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock, CardFooterGroup } from '@kadena/kode-ui/patterns';

const Home = () => {
  const { accounts, selectAccount } = useAccount();

  return (
    <>
      <CardContentBlock title="Login">
        {accounts ? (
          <Stack flexDirection="column" width="100%" gap="xl">
            <Text>Select 1 of your accounts:</Text>
            {accounts.length > 1 && (
              <Stack
                as="ul"
                flexDirection="column"
                gap="md"
                style={{ paddingInline: '0' }}
              >
                {accounts.map((account) => (
                  <Stack as="li" key={account.address} width="100%">
                    <Button
                      onPress={() => selectAccount(account)}
                      style={{ width: '100%' }}
                    >
                      {account.alias
                        ? account.alias
                        : maskValue(account.address)}
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        ) : (
          <>
            <Text>Please connect your Kadena Account</Text>
          </>
        )}
      </CardContentBlock>
      {!accounts && (
        <CardFooterGroup>
          <ContextMenu
            trigger={
              <Button endVisual={<MonoKeyboardArrowDown />}>
                Select a wallet
              </Button>
            }
          >
            <MagicConnect />
            <EckoWalletConnect />
            <ChainweaverWalletConnect />
          </ContextMenu>
        </CardFooterGroup>
      )}
    </>
  );
};

export default Home;
