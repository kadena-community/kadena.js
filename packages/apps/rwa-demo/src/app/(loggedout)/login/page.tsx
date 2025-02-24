'use client';
import { EckoWalletConnect } from '@/components/EckoWalletConnect/EckoWalletConnect';
import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import { Button, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock, CardFooterGroup } from '@kadena/kode-ui/patterns';

const Home = () => {
  const { login, accounts, selectAccount } = useAccount();
  const handleConnect = async (type: keyof typeof WALLETTYPES) => {
    await login(type);
  };

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
                      {account.alias}
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        ) : (
          <>
            <Text>Please connect with your Kadena</Text>
          </>
        )}
      </CardContentBlock>
      {!accounts && (
        <CardFooterGroup>
          <EckoWalletConnect />
          <Button onPress={() => handleConnect(WALLETTYPES.CHAINWEAVER)}>
            Chainweaver Connect
          </Button>
        </CardFooterGroup>
      )}
    </>
  );
};

export default Home;
