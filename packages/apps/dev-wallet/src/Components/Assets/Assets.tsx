import { Fungible, IAccount } from '@/modules/account/account.repository';
import { MonoWallet } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import classNames from 'classnames';
import { useMemo } from 'react';
import { AddTokenForm } from './AddTokenForm';
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
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
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
    <>
      <AddTokenForm isOpen={isRightAsideExpanded} />
      <Stack flexDirection={'column'} gap={'md'}>
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading as="h4">Your Assets</Heading>
          {showAddToken && (
            <Button
              variant="outlined"
              isCompact
              onPress={() => {
                setIsRightAsideExpanded(true);
              }}
            >
              Add new asset
            </Button>
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
    </>
  );
}
