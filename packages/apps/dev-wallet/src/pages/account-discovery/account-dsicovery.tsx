import {
  IKeyItem,
  IKeySource,
  walletRepository,
} from '@/modules/wallet/wallet.repository';
import {
  Button,
  Card,
  Checkbox,
  Heading,
  Stack,
  Text,
  Link as UiLink,
} from '@kadena/kode-ui';
import { useState } from 'react';

import { ListItem } from '@/Components/ListItem/ListItem';
import { IOwnedAccount } from '@/modules/account/account.repository';
import {
  IWalletDiscoveredAccount,
  accountDiscovery,
} from '@/modules/account/account.service';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { keySourceRepository } from '@/modules/key-source/key-source.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { ChainId } from '@kadena/client';
import { MonoKey, MonoLoading } from '@kadena/kode-icons/system';
import { PactNumber } from '@kadena/pactjs';
import { Link } from 'react-router-dom';
import { Label } from '../transaction/components/helpers';
import { pendingClass } from '../transaction/components/style.css';

const NUMBER_OF_KEYS_TO_DISCOVER = 20;

export function AccountDiscovery() {
  const navigate = usePatchedNavigate();
  const { profile, keySources, unlockKeySource, networks } = useWallet();
  const [key, setKey] = useState<{ [key: string]: IKeyItem }>({});
  const [discoveryStatus, setDiscoveryStatus] = useState<
    'idle' | 'discovering' | 'finished'
  >('idle');
  const [discoveredAccounts, setDiscoveredAccounts] = useState<
    Array<IWalletDiscoveredAccount | undefined>
  >([]);
  const [accounts, setAccounts] = useState<IOwnedAccount[]>();
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(
    networks.map((network) => network.uuid),
  );

  async function start(keySource: IKeySource) {
    if (!selectedNetworks.length || !keySource || !profile) return [];
    if (
      keySource.source !== 'HD-BIP44' &&
      keySource.source !== 'HD-chainweaver'
    ) {
      throw new Error('Unsupported key source');
    }

    await unlockKeySource(keySource);
    const process = accountDiscovery(
      networks.filter((network) => selectedNetworks.includes(network.uuid)),
      keySource,
      profile.uuid,
      NUMBER_OF_KEYS_TO_DISCOVER,
    )
      .on('key-retrieved', (data: IKeyItem) => {
        setKey((st) => ({ ...st, [keySource.source]: data }));
      })
      .on('chain-result', (data: IWalletDiscoveredAccount) => {
        setDiscoveredAccounts((prev) => [...prev, data]);
      });

    const accounts = await process.execute().catch((e) => {
      console.log('error', e);
      return [] as IOwnedAccount[];
    });
    if (Array.isArray(accounts) && accounts.length) {
      setAccounts((acc = []) => [...acc, ...accounts]);
    }
    return accounts ?? ([] as IOwnedAccount[]);
  }

  console.log('accounts', discoveredAccounts);
  const filteredDiscoveredAccounts = discoveredAccounts.filter(
    (data) => data?.result,
  ) as Array<{
    chainId: ChainId;
    networkUUID: string;
    result: Exclude<IWalletDiscoveredAccount['result'], undefined>;
  }>;

  async function startDiscovery() {
    setDiscoveryStatus('discovering');
    const ks = [];
    for (const keySource of keySources) {
      const accounts = await start(keySource);
      ks.push({ keySource, accounts });
    }
    const mostUsedKs = ks.reduce((acc, data) =>
      acc.accounts.length < data.accounts.length ? data : acc,
    );
    if (mostUsedKs.accounts.length) {
      keySourceRepository.patchKeySource(mostUsedKs.keySource.uuid, {
        isDefault: true,
      });
      const networkUUID = mostUsedKs.accounts[0].networkUUID;
      await walletRepository.patchProfile(profile!.uuid, {
        selectedNetworkUUID: networkUUID,
      });
    }
    setDiscoveryStatus('finished');
  }

  return (
    <Stack style={{ width: '100vw', maxWidth: '1200px' }}>
      <Card fullWidth>
        <Stack
          margin="md"
          flexDirection={'column'}
          gap="md"
          flex={1}
          alignItems={'flex-start'}
          justifyContent={'flex-start'}
          textAlign="left"
        >
          <Heading variant="h2">Find Your Assets</Heading>
          <Text>
            We will discover the accounts that you have created with the
            imported mnemonic
          </Text>
          {discoveryStatus === 'idle' && (
            <>
              <Stack flexDirection={'column'}>
                <Text bold color="emphasize">
                  Networks:
                </Text>
                <Text>Please select the networks you want to query</Text>
              </Stack>
              <Stack gap="sm" flexDirection={'column'}>
                {networks.map((network) => (
                  <Checkbox
                    key={network.networkId}
                    isSelected={selectedNetworks.includes(network.uuid)}
                    onChange={(checked) => {
                      setSelectedNetworks(
                        checked
                          ? [...selectedNetworks, network.uuid]
                          : selectedNetworks.filter((n) => n !== network.uuid),
                      );
                    }}
                  >
                    {network.name
                      ? `${network.networkId} - ${network.name}`
                      : network.networkId}
                  </Checkbox>
                ))}
              </Stack>

              <Stack marginBlockStart={'md'} gap={'sm'}>
                <Button
                  isDisabled={selectedNetworks.length === 0}
                  onClick={startDiscovery}
                >
                  Continue
                </Button>
                <UiLink component={Link} href="/">
                  Skip
                </UiLink>
              </Stack>
            </>
          )}

          {discoveryStatus === 'discovering' && (
            <Stack gap={'md'} flexDirection={'column'}>
              <Stack gap={'md'} alignItems={'center'}>
                <MonoLoading className={pendingClass} fontSize={24} />
                <Heading variant="h4">Please wait ...</Heading>
              </Stack>
              <Text>We are checking first 20 keys form each method</Text>
            </Stack>
          )}

          {discoveryStatus === 'discovering' &&
            keySources.map((keySource) => (
              <Stack gap={'md'} key={keySource.uuid}>
                <Text>
                  {keySource.source}
                  {key[keySource.source]?.index === undefined
                    ? ''
                    : `(${key[keySource.source]?.index})`}
                </Text>
                <Stack gap={'sm'}>
                  {key[keySource.source]?.publicKey ? (
                    <>
                      <Text color="emphasize" bold>
                        k:{key[keySource.source]?.publicKey}
                      </Text>
                    </>
                  ) : (
                    <Text color="emphasize" bold>
                      Pending...
                    </Text>
                  )}
                </Stack>
              </Stack>
            ))}
          {discoveryStatus === 'discovering' && (
            <Stack marginBlockStart={'lg'} flexDirection={'column'} gap={'lg'}>
              <Heading variant="h4">Discoverd Funds</Heading>
              {filteredDiscoveredAccounts.length === 0 ? (
                <Text>Pending</Text>
              ) : (
                <Stack flex={1} flexDirection={'column'} gap={'sm'}>
                  {networks
                    .filter((n) => selectedNetworks.includes(n.uuid))
                    .map((network) => (
                      <Stack key={network.uuid} gap={'md'}>
                        <Label>{network.networkId}</Label>
                        <Text>
                          {filteredDiscoveredAccounts
                            .filter((d) => d.networkUUID === network.uuid)
                            .reduce((acc, data) => {
                              return new PactNumber(data.result.balance)
                                .plus(acc)
                                .toDecimal();
                            }, '0')}{' '}
                          KDA
                        </Text>
                      </Stack>
                    ))}
                </Stack>
              )}
            </Stack>
          )}
          {discoveryStatus === 'finished' && (
            <Stack marginBlockStart={'lg'} flexDirection={'column'} gap={'lg'}>
              <Heading variant="h4">Discoverd Accounts</Heading>
              {!accounts?.length && <Text>no accounts found</Text>}
              <Stack flexDirection={'column'} flex={1}>
                {accounts?.map((account, index) => (
                  <ListItem key={index}>
                    <Stack gap={'md'} flex={1}>
                      <Stack gap={'sm'} flex={1}>
                        <Text>{account.address}</Text>
                      </Stack>

                      <Stack gap={'md'}>
                        <Text>{account.guard.pred}:</Text>
                        {account.guard.keys.map((key) => (
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
                  isDisabled={discoveryStatus !== 'finished'}
                  onClick={async () => {
                    keySourceManager.disconnect();
                    navigate('/');
                  }}
                >
                  Go to your assets
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
