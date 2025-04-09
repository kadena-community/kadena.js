import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useRequests } from '@/modules/communication/communication.provider';
import { addTransaction } from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { panelClass } from '../home/style.css';
import { TxList } from './components/TxList';

export const SignRequest = ({
  requestId,
  onSign,
  onAbort,
}: {
  requestId?: string;
  onSign?: () => void;
  onAbort?: () => void;
}) => {
  const { profile, networks, activeNetwork } = useWallet();
  const requests = useRequests();
  const [tx, setTx] = useState<ITransaction>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const run = async () => {
      if (profile?.uuid && requestId) {
        const tx = requests.get(requestId)?.payload as IUnsignedCommand;
        if (!tx) {
          setError('No transaction');
          return;
        }
        const cmd: IPactCommand = JSON.parse(tx.cmd);
        const networkUUID =
          networks.find(({ networkId }) => networkId === cmd.networkId)?.uuid ??
          activeNetwork?.uuid;

        if (!networkUUID) {
          setError(`Network not found for ${cmd.networkId}`);
          return;
        }

        const transaction = await addTransaction({
          transaction: tx as IUnsignedCommand,
          profileId: profile?.uuid,
          networkUUID: networkUUID,
          groupId: requestId,
        });

        setTx(transaction);
      }
    };
    run();
  }, [requestId, profile?.uuid, requests, networks, activeNetwork?.uuid]);

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoSwapHoriz />}>
        <SideBarBreadcrumbsItem href={`/transactions`}>
          Activities
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/sign-request/${requestId}`}>
          Sign Request
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      {error ? (
        <Notification intent="negative" role="alert">
          {error}
        </Notification>
      ) : (
        <Stack flexDirection={'column'} gap={'lg'} overflow="auto">
          <Stack flexDirection={'column'} gap={'sm'}>
            <Heading>Sign Request</Heading>
            {!tx && <Text>No transaction</Text>}
          </Stack>
          <Stack
            flexDirection={'column'}
            gap={'sm'}
            className={panelClass}
            alignItems={'flex-start'}
          >
            <Stack gap={'sm'} flexDirection={'row'}>
              <Text bold color="emphasize">
                Request ID:
              </Text>
              <Text variant="code">{requestId}</Text>
            </Stack>
            <Button
              variant="negative"
              onClick={() => {
                if (tx?.uuid) {
                  transactionRepository.deleteTransaction(tx?.uuid);
                }
                if (requestId) {
                  const request = requests.get(requestId);
                  if (request) {
                    console.log('resolving request', request);
                    request.reject({ status: 'rejected' });
                  }
                }
                if (onAbort) onAbort();
              }}
            >
              Reject
            </Button>
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
                  if (onSign) onSign();
                }
              }
            }}
          />
        </Stack>
      )}
    </>
  );
};

export const SignRequestPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  return <SignRequest requestId={requestId} />;
};
