import { Assets } from '@/Components/Assets/Assets';
import { Fungible, IAccount } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css.ts';

import { noStyleLinkClass } from '@/Components/Accounts/style.css';
import { ListItem } from '@/Components/ListItem/ListItem';
import { transactionRepository } from '@/modules/transaction/transaction.repository';
import { getAccountName, shorten } from '@/utils/helpers';
import { useAsync } from '@/utils/useAsync';
import { IPactCommand } from '@kadena/client';
import { MonoContentCopy } from '@kadena/kode-icons/system';

import { AccountItem } from '@/Components/AccountItem/AccountItem';
import {
  AccordionItem,
  Box,
  Button,
  Heading,
  Stack,
  TabItem,
  Tabs,
  Text,
} from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { listClass } from '../account/style.css';
import { linkClass } from '../select-profile/select-profile.css';
import { TransactionList } from '../transactions/transactions';

export function HomePage() {
  const { accounts, profile, fungibles, activeNetwork } = useWallet();
  console.log('activeNetwork', activeNetwork);

  const [transactions] = useAsync(
    async (profile, activeNetwork) => {
      if (profile?.uuid && activeNetwork?.uuid) {
        const txs = (
          await transactionRepository.getTransactionList(
            profile.uuid,
            activeNetwork?.uuid,
          )
        )
          .map((tx) => ({
            ...tx,
            creationDate:
              (JSON.parse(tx.cmd) as IPactCommand).meta.creationTime || 0,
          }))
          .sort((a, b) => b.creationDate - a.creationDate);

        return txs.slice(0, 5);
      }
    },
    [profile, activeNetwork] as const,
  );

  return (
    <Box gap={'lg'}>
      <Text>Welcome back</Text>
      <Heading as="h1">{profile?.name} </Heading>
      <Stack gap={'lg'} flexDirection={'column'}>
        <Box className={panelClass} marginBlockStart="xl">
          <Box marginBlockStart={'sm'}>
            <Assets accounts={accounts} fungibles={fungibles} showAddToken />
          </Box>
        </Box>
        <Accounts accounts={accounts} />
        <Stack className={panelClass} flexDirection={'column'} gap={'lg'}>
          <Heading variant="h4">Wallet Activities</Heading>
          <Stack>
            <Tabs>
              <TabItem title="Transactions">
                <TransactionList transactions={transactions || []} />
                <Stack paddingBlockStart={'lg'}>
                  <Link to="/transactions" className={linkClass}>
                    All transactions
                  </Link>
                </Stack>
              </TabItem>
              <TabItem title="Transfers">WIP: Not implemented yet</TabItem>
            </Tabs>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export function Accounts({ accounts }: { accounts: IAccount[] }) {
  return (
    <Box className={panelClass} marginBlockStart="xs">
      <Heading as="h4">Your accounts</Heading>
      <Link to="/create-account" className={linkClass}>
        Create Account
      </Link>
      {accounts.length ? (
        <Box marginBlockStart="md">
          <ul className={listClass}>
            {accounts.map((account) => (
              <li key={account.uuid}>
                <AccountItem account={account} />
              </li>
            ))}
          </ul>
        </Box>
      ) : null}
    </Box>
  );
}
