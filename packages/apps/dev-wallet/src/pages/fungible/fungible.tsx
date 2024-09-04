import { Accounts } from '@/Components/Accounts/Accounts';
import { ListItem } from '@/Components/ListItem/ListItem';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { getAccountName } from '@/utils/helpers';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { Link, useParams } from 'react-router-dom';
import { listClass, noStyleLinkClass } from '../home/style.css';

export function FungiblePage() {
  const { contract } = useParams<{ contract: string }>();
  const { fungibles, accounts, keysets } = useWallet();
  const asset = fungibles.find((f) => f.contract === contract);

  if (!asset) {
    return <Stack>Contract not found: {contract}</Stack>;
  }

  const balance = accounts.reduce((acc, { contract, overallBalance }) => {
    if (contract === asset.contract) {
      return acc.plus(overallBalance);
    }
    return acc;
  }, new PactNumber('0.0'));

  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      <Stack flexDirection={'column'}>
        <Heading variant="h3">
          {asset.symbol}: {balance.toDecimal()}
        </Heading>
        <Heading variant="h5">contract: {asset.contract}</Heading>
      </Stack>
      <Accounts
        accounts={accounts.filter((account) => account.contract === contract)}
        keysets={keysets}
        asset={asset}
      />
    </Stack>
  );
}
