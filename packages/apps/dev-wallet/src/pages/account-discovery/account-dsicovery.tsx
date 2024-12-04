import { IKeyItem } from '@/modules/wallet/wallet.repository';
import { Button, Card, Heading, Stack, Text } from '@kadena/kode-ui';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ListItem } from '@/Components/ListItem/ListItem';
import { IAccount } from '@/modules/account/account.repository';
import {
  IDiscoveredAccount,
  accountDiscovery,
} from '@/modules/account/account.service';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { ChainId } from '@kadena/client';
import { MonoKey } from '@kadena/kode-icons/system';

const NUMBER_OF_KEYS_TO_DISCOVER = 20;

export function AccountDiscovery() {
  const navigate = usePatchedNavigate();
  const processRef = useRef<ReturnType<typeof accountDiscovery>>();
  const { profile, keySources, unlockKeySource, activeNetwork } = useWallet();
  const { keySourceId } = useParams();
  const [key, setKey] = useState<IKeyItem>();
  const [discoveryStatus, setDiscoveryStatus] = useState<
    'idle' | 'discovering' | 'finished'
  >('idle');
  const [discoveredAccounts, setDiscoveredAccounts] = useState<
    Array<IDiscoveredAccount | undefined>
  >([]);
  const [accounts, setAccounts] = useState<IAccount[]>();

  async function start() {
    const keySource = keySources.find((ks) => ks.uuid === keySourceId);
    if (!activeNetwork || !keySource || !profile) return;
    if (
      keySource.source !== 'HD-BIP44' &&
      keySource.source !== 'HD-chainweaver'
    ) {
      throw new Error('Unsupported key source');
    }
    setDiscoveryStatus('discovering');
    await unlockKeySource(keySource);
    processRef.current = accountDiscovery(
      activeNetwork,
      keySource,
      profile.uuid,
      NUMBER_OF_KEYS_TO_DISCOVER,
    )
      .on('key-retrieved', (data: IKeyItem) => {
        setKey(data);
      })
      .on('chain-result', (data: IDiscoveredAccount) => {
        setDiscoveredAccounts((prev) => [...prev, data]);
      });
    const accounts = await processRef.current.executeTo('query-done');
    if (!accounts || !accounts.length) {
      keySourceManager.disconnect();
    }
    setDiscoveryStatus('finished');
    setAccounts(accounts);
  }

  console.log('accounts', discoveredAccounts);
  const filteredDiscoveredAccounts = discoveredAccounts.filter(
    (data) => data?.result,
  ) as Array<{
    chainId: ChainId;
    result: Exclude<IDiscoveredAccount['result'], undefined>;
  }>;

  return (
    <Card>
      <Stack margin="md" flexDirection={'column'} gap="md" flex={1}>
        <Heading variant="h2">Account Discovery</Heading>
        <Text>
          You can discover the accounts that you have created with the imported
          mnemonic
        </Text>
        <Stack gap="md">
          <Text bold color="emphasize">
            network:
          </Text>
          <Text>{activeNetwork?.networkId}</Text>
        </Stack>

        {discoveryStatus === 'idle' && (
          <Stack>
            <Button
              onClick={() => {
                start();
              }}
            >
              Start Discovery
            </Button>
          </Stack>
        )}

        {discoveryStatus === 'discovering' && (
          <Card fullWidth>
            <Text> We are trying for first 20 keys - only K: account</Text>
            <Stack gap={'sm'}>
              <Text>checking</Text>
              {key && (
                <>
                  <Text color="emphasize">#{key.index}</Text>
                  <Text>Address: </Text>
                  <Text color="emphasize" bold>
                    k:{key.publicKey}
                  </Text>
                </>
              )}
            </Stack>
          </Card>
        )}
        {discoveryStatus !== 'idle' && (
          <Stack marginBlockStart={'lg'} flexDirection={'column'} gap={'lg'}>
            <Heading variant="h4">Discoverd Accounts Details</Heading>
            {filteredDiscoveredAccounts.length === 0 ? (
              <Text>no accounts found yet</Text>
            ) : (
              <Stack flexDirection={'column'} flex={1}>
                {filteredDiscoveredAccounts.map((data, index) => (
                  <ListItem key={index}>
                    <Stack gap={'md'} flex={1}>
                      <Stack gap={'sm'} flex={1}>
                        <Text>Chain #{data.chainId}: </Text>
                        <Text>{data.result.account}</Text>
                      </Stack>
                      <Stack gap={'md'}>
                        <Text>{data.result.guard.pred}:</Text>
                        {data.result.guard.keys.map((key) => (
                          <Stack gap={'xs'} alignItems={'center'}>
                            <Text>
                              <MonoKey />
                            </Text>
                            <Text variant="code">{shorten(key)}</Text>{' '}
                          </Stack>
                        ))}
                        <Text>{data.result.balance} KDA</Text>
                      </Stack>
                    </Stack>
                  </ListItem>
                ))}
              </Stack>
            )}
          </Stack>
        )}
        {accounts && (
          <Stack marginBlockStart={'lg'} flexDirection={'column'} gap={'lg'}>
            <Heading variant="h4">Discoverd Accounts</Heading>
            {!accounts.length && <Text>no accounts found</Text>}
            <Stack flexDirection={'column'} flex={1}>
              {accounts.map((account, index) => (
                <ListItem key={index}>
                  <Stack gap={'md'} flex={1}>
                    <Stack gap={'sm'} flex={1}>
                      <Text>{account.address}</Text>
                    </Stack>

                    <Stack gap={'md'}>
                      <Text>{account.keyset?.guard.pred}:</Text>
                      {account.keyset?.guard.keys.map((key) => (
                        <Stack gap={'xs'} alignItems={'center'}>
                          <Text>
                            <MonoKey />
                          </Text>
                          <Text variant="code">{shorten(key)}</Text>{' '}
                        </Stack>
                      ))}
                      <Text>{account.overallBalance} KDA</Text>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
            </Stack>
            <Stack alignItems={'flex-start'} gap={'sm'}>
              <Button
                variant="transparent"
                onClick={() => {
                  keySourceManager.disconnect();
                  navigate('/');
                }}
              >
                Discard
              </Button>
              <Button
                onClick={async () => {
                  await processRef.current?.execute();
                  keySourceManager.disconnect();
                  navigate('/');
                }}
              >
                Save Accounts
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
