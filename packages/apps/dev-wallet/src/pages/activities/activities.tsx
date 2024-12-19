import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import {
  activityRepository,
  IActivity,
} from '@/modules/activity/activity.repository';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IPactCommand } from '@kadena/client';
import {
  MonoMultipleStop,
  MonoSignpost,
  MonoSwapHoriz,
} from '@kadena/kode-icons/system';
import { Heading, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { ActivityTable } from '../account/Components/ActivityTable';
import { TransactionList } from './transactions';

export function ActivitiesPage() {
  const { profile, activeNetwork } = useWallet();
  const [transactions, setTransactions] = useState<
    (ITransaction & { creationDate: number })[]
  >([]);
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    const run = async () => {
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

        setTransactions(txs);
      }
      if (profile?.uuid && activeNetwork?.uuid) {
        const activityList = await activityRepository.getAllActivities(
          profile.uuid,
          activeNetwork?.uuid,
        );
        setActivities(activityList);
      }
    };
    run();
  }, [profile?.uuid, activeNetwork?.uuid]);

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoSwapHoriz />}>
        <SideBarBreadcrumbsItem href="/transactions">
          Transactions
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack width="100%" flexDirection="column" gap="md">
        <Heading as="h4">Transactions</Heading>
        <Tabs>
          <TabItem
            key={'transactions'}
            title={
              <Stack justifyContent={'center'} alignItems={'center'} gap={'md'}>
                <MonoMultipleStop />
                <Text>Transactions</Text>
              </Stack>
            }
          >
            <TransactionList transactions={transactions} />
          </TabItem>
          <TabItem
            key={'activities'}
            title={
              <Stack justifyContent={'center'} alignItems={'center'} gap={'md'}>
                <MonoSignpost />
                <Text>Activities</Text>
              </Stack>
            }
          >
            {activities.length > 0 && <ActivityTable activities={activities} />}
          </TabItem>
        </Tabs>
      </Stack>
    </>
  );
}
