import { AssetsCard } from '@/Components/AssetsCard/AssetsCard';
import { Breadcrumbs } from '@/Components/Breadcrumbs/Breadcrumbs';
import { transactionRepository } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css.ts';
import { useAsync } from '@/utils/useAsync';
import { IPactCommand } from '@kadena/client';
import { MonoDashboard } from '@kadena/kode-icons/system';
import { Box, Heading, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { Link } from 'react-router-dom';
import { linkClass } from '../select-profile/select-profile.css';
import { TransactionList } from '../transactions/transactions';

export function HomePage() {
  const { profile, activeNetwork } = useWallet();

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
    <>
      <Breadcrumbs icon={<MonoDashboard />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
      </Breadcrumbs>
      <Box gap={'lg'}>
        <Text>Welcome back</Text>
        <Heading as="h1">{profile?.name} </Heading>
        <Stack gap={'lg'} flexDirection={'column'}>
          <AssetsCard />
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
    </>
  );
}
