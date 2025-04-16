import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { useRequests } from '@/modules/communication/communication.provider';
import { addTransaction } from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { Button, Card, Notification, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (error) {
    return (
      <Notification intent="negative" role="alert" type="inlineStacked">
        {error}
      </Notification>
    );
  }

  return (
    <Stack flexDirection={'column'} width="100%" marginBlockEnd={'md'}>
      <Card fullWidth>
        <CardContentBlock
          title="Sign Request"
          supportingContent={
            <>
              <Button
                variant="negative"
                isCompact
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
            </>
          }
        >
          {!tx && <Text>No transaction</Text>}

          <Stack gap={'sm'} flexDirection={'row'}>
            <Text bold color="emphasize">
              Request ID:
            </Text>
            <Text variant="code">{requestId}</Text>
          </Stack>
        </CardContentBlock>
      </Card>
      <Stack
        flexDirection={'column'}
        gap={'lg'}
        overflow="auto"
        marginBlockStart="md"
      >
        <TxList
          onDone={() => {
            console.log('done');
          }}
          txIds={tx ? [tx.uuid] : []}
          showExpanded={true}
          sendDisabled={true}
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
    </Stack>
  );
};

export const SignRequestPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  return <SignRequest requestId={requestId} />;
};
