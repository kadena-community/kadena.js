import { IKeyItem } from '@/modules/wallet/wallet.repository';
import { Box, Heading, Text } from '@kadena/react-ui';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  IDiscoveredAccount,
  accountDiscovery,
} from '@/modules/account/account.service';
import { useNetwork } from '@/modules/network/network.hook';
import { useWallet } from '@/modules/wallet/wallet.hook';

const NUMBER_OF_KEYS_TO_DISCOVER = 20;

export function AccountDiscovery() {
  const { profile, keySources } = useWallet();
  const { keySourceId } = useParams();
  const [key, setKey] = useState<IKeyItem>();
  const [discoveryStatus, setDiscoveryStatus] = useState<
    'idle' | 'discovering' | 'finished'
  >('idle');
  const [accounts, setAccounts] = useState<
    Array<IDiscoveredAccount | undefined>
  >([]);
  const { activeNetwork } = useNetwork();

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
    await accountDiscovery(
      activeNetwork.networkId,
      keySource,
      profile.uuid,
      NUMBER_OF_KEYS_TO_DISCOVER,
    )
      .on('key-retrieved', (data: IKeyItem) => {
        setKey(data);
      })
      .on('chain-result', (data: IDiscoveredAccount) => {
        setAccounts((prev) => [...prev, data]);
      })
      .execute();
    setDiscoveryStatus('finished');
  }

  return (
    <>
      <Box margin="md">
        <Heading variant="h5">Account Discovery</Heading>

        <Text>network: {activeNetwork?.networkId}</Text>

        {discoveryStatus === 'idle' && (
          <button
            onClick={() => {
              start();
            }}
          >
            Start Discovery
          </button>
        )}

        {discoveryStatus === 'finished' && (
          <Box>
            <Text bold>Discovery finished</Text>
          </Box>
        )}

        {discoveryStatus === 'discovering' && (
          <>
            <Text> We are trying for first 20 keys - only K: account</Text>
            <Box>
              <Text>
                checking{' '}
                {key && (
                  <Text>
                    {' '}
                    #{key.index} Address: `k:{key.publicKey} `
                  </Text>
                )}
              </Text>
            </Box>
          </>
        )}
        <Heading variant="h6">Discoverd Accounts</Heading>
        {accounts.length === 0 ? (
          <Text>no accounts found yet</Text>
        ) : (
          <ul>
            {accounts.map(
              (data, index) =>
                data?.result && (
                  <li key={index}>
                    <Box>
                      account: {data.result.account}
                      <br /> keys:[{data.result.guard.keys.join(',')}]
                      <br /> chainId: {data.chainId}
                      <br /> balance: {data.result.balance}
                    </Box>
                  </li>
                ),
            )}
          </ul>
        )}
      </Box>
    </>
  );
}
