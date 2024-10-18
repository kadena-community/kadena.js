import { Accounts } from '@/Components/Accounts/Accounts';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Heading, Stack } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { useParams } from 'react-router-dom';

export function FungiblePage() {
  const { contract } = useParams<{ contract: string }>();
  const { fungibles, accounts } = useWallet();
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

  if (!contract) {
    throw new Error('No contract');
  }

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
        contract={contract}
      />
    </Stack>
  );
}
