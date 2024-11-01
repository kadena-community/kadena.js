import { Fungible, IAccount } from '@/modules/account/account.repository';
import { createAsideUrl } from '@/utils/createAsideUrl';
import { MonoWallet } from '@kadena/kode-icons/system';
import { Heading, Link as LinkUI, Stack, Text } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { assetBoxClass } from './style.css';

export function Assets({
  selectedContract,
  setSelectedContract,
  accounts,
  fungibles,
  showAddToken = false,
}: {
  selectedContract: string;
  setSelectedContract: (contract: string) => void;
  accounts: IAccount[];
  fungibles: Fungible[];
  showAddToken?: boolean;
}) {
  const assets = useMemo(() => {
    return fungibles.map((item) => {
      const acs = accounts.filter((a) => a.contract === item.contract);
      return {
        ...item,
        accounts: acs,
        balance: acs
          .reduce((acc, a) => acc.plus(a.overallBalance), new PactNumber(0))
          .toDecimal(),
      };
    });
  }, [accounts, fungibles]);

  return (
    <Stack flexDirection={'column'} gap={'md'}>
      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Heading as="h4">Your Assets</Heading>
        {showAddToken && (
          <Link to={createAsideUrl('NewAsset')}>
            <LinkUI variant="outlined" isCompact>
              Add new asset
            </LinkUI>
          </Link>
        )}
      </Stack>
      <Stack gap={'md'}>
        {assets.map((asset) => (
          <Stack
            alignItems={'center'}
            className={classNames(
              assetBoxClass,
              asset.contract === selectedContract && 'selected',
            )}
            gap={'lg'}
            onClick={() => setSelectedContract(asset.contract)}
          >
            <Stack alignItems={'center'} gap={'sm'}>
              <Text>
                <MonoWallet />
              </Text>
              <Text>{asset.symbol}</Text>
            </Stack>
            <Text color="emphasize" bold>
              {asset.balance}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
