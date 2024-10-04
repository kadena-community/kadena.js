import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';

import { fundAccount } from '@/modules/account/account.service';

import { AccountBalanceDistribution } from '@/Components/AccountBalanceDistribution/AccountBalanceDistribution';
import { QRCode } from '@/Components/QRCode/QRCode';
import { getTransferActivities } from '@/modules/activity/activity.service';
import { useAsync } from '@/utils/useAsync';
import { ChainId } from '@kadena/client';
import { MonoKey } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { TxList } from '../transaction/components/TxList';
import { linkClass } from '../transfer/style.css';
import { ActivityTable } from './Components/ActivityTable';
import { Redistribute } from './Components/Redistribute';

export function AccountPage() {
  const { accountId } = useParams();
  const { activeNetwork, fungibles, accounts } = useWallet();
  const [redistributionGroupId, setRedistributionGroupId] = useState<string>();
  const account = accounts.find((account) => account.uuid === accountId);
  const navigate = useNavigate();
  const keyset = account?.keyset;
  const asset = fungibles.find((f) => f.contract === account?.contract);
  const [activities = []] = useAsync(getTransferActivities, [
    account?.keyset?.uuid,
    activeNetwork?.networkId,
  ]);

  const chains = account?.chains;
  const chainsBalance = useMemo(
    () =>
      (chains ?? []).map(({ balance, chainId }) => ({
        chainId,
        balance: +balance,
      })),
    [chains],
  );
  if (!account || !keyset || !asset) {
    return null;
  }

  const fundAccountHandler = async (chainId: ChainId) => {
    if (!keyset) {
      throw new Error('No keyset found');
    }
    const { groupId } = await fundAccount({
      address: account?.address ?? keyset.principal,
      chainId,
      keyset,
      profileId: keyset?.profileId,
      networkId: activeNetwork?.networkId ?? 'testnet04',
    });

    navigate(`/transaction/${groupId}`);
  };

  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      <Stack flexDirection={'column'} gap={'sm'}>
        {account.alias && <Heading variant="h3">{account.alias}</Heading>}
        <Stack justifyContent={'space-between'}>
          <Heading variant="h5">{account.address}</Heading>
        </Stack>

        <Stack flexDirection={'row'} gap="sm" alignItems={'center'}>
          <Heading variant="h3">
            {account.overallBalance} {asset.symbol}
          </Heading>
        </Stack>
      </Stack>
      <Stack gap="md">
        <Link
          to={`/transfer?accountId=${account.uuid}`}
          className={noStyleLinkClass}
        >
          <Button
            isCompact
            isDisabled={+account.overallBalance === 0}
            onPress={(e: any) => {
              e.preventDefault();
            }}
          >
            Transfer
          </Button>
        </Link>
        {asset.contract === 'coin' &&
          (activeNetwork?.networkId === 'testnet05' ||
            activeNetwork?.networkId === 'testnet04') && (
            <Button
              variant="outlined"
              isCompact
              onPress={() =>
                fundAccountHandler(
                  Math.floor(Math.random() * 20).toString() as ChainId,
                )
              }
            >
              Fund on Testnet
            </Button>
          )}
        {asset.contract === 'coin' && (
          <a
            className={linkClass}
            href="https://www.kadena.io/kda-token#:~:text=activities%2C%20and%20events.-,Where%20to%20Buy%20KDA,-Buy"
            target="_blank"
          >
            <Button variant="outlined" isCompact>
              Buy KDA
            </Button>
          </a>
        )}
      </Stack>
      <Tabs>
        <TabItem key="guard" title="Details">
          <Stack gap="lg">
            <QRCode
              ecLevel="L"
              size={150}
              value={JSON.stringify({
                address: account.address,
                contract: account.contract,
                guard: keyset.guard,
              })}
            />
            <Stack
              flexWrap="wrap"
              flexDirection={'column'}
              paddingBlockStart={'sm'}
              gap={'lg'}
            >
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>Contract</Text>
                <Text color="emphasize" variant="code">
                  {account.contract}
                </Text>
              </Stack>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>Address</Text>
                <Text color="emphasize" variant="code">
                  {account.address}
                </Text>
              </Stack>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>Predicate</Text>
                <Text color="emphasize" variant="code">
                  {keyset.guard.pred}
                </Text>
              </Stack>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>Keys</Text>
                {keyset.guard.keys.map((key) => (
                  <Stack key={key} gap="sm" alignItems={'center'}>
                    <Text>
                      <MonoKey />
                    </Text>
                    <Text variant="code" color="emphasize">
                      {key}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </TabItem>
        <TabItem key={'chain-distribution'} title="Chain Distribution">
          <Stack gap={'sm'} flexWrap={'wrap'}>
            {!redistributionGroupId ? (
              <AccountBalanceDistribution
                chains={chainsBalance}
                overallBalance={account.overallBalance}
                fundAccount={fundAccountHandler}
                account={account}
                onRedistribution={(groupId) =>
                  setRedistributionGroupId(groupId)
                }
              />
            ) : (
              <Redistribute
                groupId={redistributionGroupId}
                onDone={() => {
                  setRedistributionGroupId(undefined);
                }}
              />
            )}
          </Stack>
        </TabItem>
        <TabItem key="account-activity" title="Account Activity">
          {!activities.length && (
            <Stack flexDirection={'column'} gap={'sm'}>
              <Text color="emphasize">No activities yet</Text>
              <Text>The transfers from this account will be listed here</Text>
            </Stack>
          )}
          {activities.length > 0 && <ActivityTable activities={activities} />}
        </TabItem>
      </Tabs>
    </Stack>
  );
}
