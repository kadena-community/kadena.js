import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useRequests } from '@/modules/communication/communication.provider';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { TxList } from './components/TxList';

export const TransactionPage = () => {
  const navigate = usePatchedNavigate();
  const { groupId } = useParams();
  const { profile } = useWallet();
  const [searchParam] = useSearchParams();
  const requestId = searchParam.get('request');
  const requests = useRequests();
  const [txs = [], setTxList] = useState<ITransaction[]>();

  useEffect(() => {
    const run = async () => {
      if (profile?.uuid && groupId) {
        const list = await transactionRepository.getTransactionsByGroup(
          groupId,
          profile.uuid,
        );
        if (!list || list.length === 0) {
          navigate('/transactions');
        }
        setTxList(list);
      }
    };
    run();
  }, [groupId, navigate, profile?.uuid]);

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoSwapHoriz />}>
        <SideBarBreadcrumbsItem href={`/transactions`}>
          Transactions
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/transactions/${groupId}`}>
          Transaction Group
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection={'column'} gap={'lg'} overflow="auto">
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
          onSign={(tx) => {
            if (requestId) {
              const request = requests.get(requestId);
              if (request) {
                console.log('resolving request', request);
                request.resolve({ status: 'signed', transaction: tx });
              }
            }
          }}
        />
      </Stack>
    </>
  );
};
