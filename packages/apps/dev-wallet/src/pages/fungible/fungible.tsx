import { AccountItem } from '@/Components/AccountItem/AccountItem';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading, Stack } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { Link, useParams } from 'react-router-dom';
import { linkClass, listClass, panelClass } from '../home/style.css';

export function FungiblePage() {
  const { contract } = useParams<{ contract: string }>();
  const { fungibles, accounts, profile } = useWallet();
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
      <Box className={panelClass} marginBlockStart="xs">
        <Heading as="h4">Your accounts</Heading>
        <Link to={`/create-account/${contract}`} className={linkClass}>
          Create Account
        </Link>
        {accounts.length ? (
          <Box marginBlockStart="md">
            <ul className={listClass}>
              {accounts.map((account) => (
                <li key={account.uuid}>
                  <AccountItem account={account} profile={profile} />
                </li>
              ))}
            </ul>
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
}
