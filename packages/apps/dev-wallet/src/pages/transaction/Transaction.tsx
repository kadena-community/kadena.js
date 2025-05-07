import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useRequests } from '@/modules/communication/communication.provider';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { MonoClose, MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import {
  FocussedLayoutHeaderAside,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { TxList } from './components/TxList';

export const TransactionPage = () => {
  const navigate = usePatchedNavigate();
  const { transactionId } = useParams();
  const { profile } = useWallet();
  const [searchParam] = useSearchParams();
  const requestId = searchParam.get('request');
  const requests = useRequests();
  const [tx, setTx] = useState<ITransaction>();

  useEffect(() => {
    const run = async () => {
      if (profile?.uuid && transactionId) {
        const tx = await transactionRepository.getTransaction(transactionId);
        if (!tx || tx.profileId !== profile.uuid) {
          navigate('/activities');
        }
        setTx(tx);
      }
    };
    run();
  }, [transactionId, navigate, profile?.uuid]);

  return (
    <>
      <FocussedLayoutHeaderAside>
        <Button
          isCompact
          variant="transparent"
          startVisual={<MonoClose />}
          onPress={() => {
            navigate('/');
          }}
        />
      </FocussedLayoutHeaderAside>

      <SideBarBreadcrumbs icon={<MonoSwapHoriz />}>
        <SideBarBreadcrumbsItem href={`/activities`}>
          Activities
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/transaction/${transactionId}`}>
          Transaction
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection={'column'} gap={'lg'} overflow="auto">
        <Stack flexDirection={'column'} gap={'sm'}>
          <Heading>Transaction</Heading>
          {!tx && <Text>No transaction</Text>}
        </Stack>
        <TxList
          onDone={() => {
            console.log('done');
          }}
          txIds={tx ? [tx.uuid] : []}
          showExpanded={true}
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
