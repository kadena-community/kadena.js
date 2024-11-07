import { transactionRepository } from '@/modules/transaction/transaction.repository';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAsync } from '@/utils/useAsync';
import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useParams } from 'react-router-dom';
import { TxList } from './components/TxList';

export const TransactionPage = () => {
  const { groupId } = useParams();
  const [txs = []] = useAsync(
    (gid) =>
      gid
        ? transactionRepository.getTransactionsByGroup(gid)
        : Promise.resolve([]),
    [groupId],
  );
  return (
    <>
      <SideBarBreadcrumbs icon={<MonoSwapHoriz />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/transactions`}>
          Transactions
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/transactions/${groupId}`}>
          Transaction Group
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection={'column'} gap={'lg'}>
        <Stack flexDirection={'column'} gap={'sm'}>
          <Heading>Transactions</Heading>
          {txs.length === 0 && <Text>No transactions</Text>}
          {txs.length >= 2 && (
            <Text>This is a group of {txs.length} Transactions</Text>
          )}
        </Stack>
        <TxList
          onDone={() => {
            console.log('done');
          }}
          txIds={txs.map((tx) => tx.uuid)}
          showExpanded={txs.length === 1}
        />
      </Stack>
    </>
  );
};
