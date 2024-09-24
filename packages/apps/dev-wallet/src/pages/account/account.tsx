import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';

import { fundAccount } from '@/modules/account/account.service';

import { Chain } from '@/Components/Badge/Badge';
import { MonoKey } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { linkClass } from '../transfer/style.css';
import { panelClass } from './style.css';

export function AccountPage() {
  const { accountId } = useParams();
  const { activeNetwork, fungibles, accounts } = useWallet();
  const account = accounts.find((account) => account.uuid === accountId);
  const navigate = useNavigate();
  const keyset = account?.keyset;
  const asset = fungibles.find((f) => f.contract === account?.contract);

  if (!account || !keyset || !asset) {
    return null;
  }
  const chains = account.chains;

  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      <Stack flexDirection={'column'} gap={'sm'}>
        {account.alias && <Heading variant="h3">{account.alias}</Heading>}
        <Stack justifyContent={'space-between'}>
          <Heading variant="h2">{shorten(account.address, 15)}</Heading>
        </Stack>

        <Stack flexWrap="wrap" flexDirection={'row'} gap="md">
          <Text>{keyset.guard.pred}:</Text>
          {keyset.guard.keys.map((key) => (
            <Stack key={key} gap="sm" alignItems={'center'}>
              <Text>
                <MonoKey />
              </Text>
              <Text variant="code">{shorten(key)}</Text>
            </Stack>
          ))}
        </Stack>

        <Stack flexDirection={'row'} gap="sm" alignItems={'center'}>
          <Text>Balance:</Text>
          <Heading variant="h3">
            {account.overallBalance} {asset.symbol}
          </Heading>
        </Stack>
        <Stack gap={'sm'} flexWrap={'wrap'}>
          {chains
            .filter(({ balance }) => +balance > 0)
            .map((chain, index, list) => (
              <Text size="smallest">
                <Stack alignItems={'center'} gap={'sm'}>
                  <Chain chainId={chain.chainId} />
                  <Text size="smallest">{chain.balance} KDA</Text>
                  {index < list.length - 1 && <Text>|</Text>}
                </Stack>
              </Text>
            ))}
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
        <Button variant="info" isCompact>
          Chain Distribution
        </Button>
        {asset.contract === 'coin' &&
          (activeNetwork?.networkId === 'testnet05' ||
            activeNetwork?.networkId === 'testnet04') && (
            <Button
              variant="outlined"
              isCompact
              onPress={async () => {
                if (!keyset) {
                  throw new Error('No keyset found');
                }
                const { groupId } = await fundAccount({
                  address: account?.address ?? keyset.principal,
                  keyset,
                  chains: account?.chains ?? [],
                  profileId: keyset?.profileId,
                  networkId: activeNetwork?.networkId,
                });

                navigate(`/transaction/${groupId}`);
              }}
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
      <Stack className={panelClass}>
        <Heading variant="h4">Account Activity</Heading>
      </Stack>
    </Stack>
  );
}
