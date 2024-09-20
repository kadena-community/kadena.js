import {
  ITransaction,
  transactionRepository,
  TransactionStatus,
} from '@/modules/transaction/transaction.repository';

import { shorten } from '@/utils/helpers';
import {
  MonoBrightness1,
  MonoCheck,
  MonoLoading,
  MonoSignature,
  MonoViewInAr,
} from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';

import classNames from 'classnames';

import { IPactCommand } from '@kadena/client';
import { isSignedCommand } from '@kadena/pactjs';

import { useAsync } from '@/utils/useAsync';
import { useEffect } from 'react';
import { Value } from './helpers';
import {
  codeClass,
  pendingClass,
  successClass,
  txTileClass,
} from './style.css';

export const steps: TransactionStatus[] = [
  'initiated',
  'signed',
  'preflight',
  'submitted',
  'failure',
  'success',
  'persisted',
];

export const statusPassed = (
  txStatus: ITransaction['status'],
  status: ITransaction['status'],
) => steps.indexOf(txStatus) >= steps.indexOf(status);

export const TxTile = ({
  tx,
  onSign,
  onSubmit,
  onView,
}: {
  tx: ITransaction;
  onSign: () => void;
  onSubmit: () => Promise<ITransaction>;
  onView: () => void;
}) => {
  const command: IPactCommand = JSON.parse(tx.cmd);
  const [contTx] = useAsync(
    (transaction) =>
      transaction.continuation?.continuationTxId
        ? transactionRepository.getTransaction(
            transaction.continuation?.continuationTxId,
          )
        : Promise.resolve(null),
    [tx],
  );
  console.log('tx', tx);
  return (
    <Stack className={txTileClass} flexDirection={'column'} gap={'md'}>
      <Stack justifyContent={'space-between'}>
        <Text>hash: {shorten(tx.hash)}</Text>
        <MonoBrightness1
          className={classNames(isSignedCommand(tx) ? successClass : '')}
        />
      </Stack>
      {statusPassed(tx.status, 'signed') && (
        <Stack>
          <Text size="smallest" className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              Signed
            </Stack>
          </Text>
        </Stack>
      )}
      {statusPassed(tx.status, 'preflight') && (
        <Stack>
          <Text size="smallest" className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              preflight
            </Stack>
          </Text>
        </Stack>
      )}
      {statusPassed(tx.status, 'submitted') && (
        <Stack>
          <Text size="smallest" className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              Send
            </Stack>
          </Text>
        </Stack>
      )}
      {statusPassed(tx.status, 'submitted') &&
        (!('result' in tx) || !tx.result) && (
          <Stack>
            <Text size="smallest" className={pendingClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoLoading />
                Polling status
              </Stack>
            </Text>
          </Stack>
        )}
      {statusPassed(tx.status, 'success') && (
        <Stack>
          <Text size="smallest" className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              Mined {tx.continuation?.autoContinue ? 'in source chain' : ''}
            </Stack>
          </Text>
        </Stack>
      )}
      {tx.status === 'failure' && (
        <Stack>
          <Text size="smallest" className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              Failed
            </Stack>
          </Text>
        </Stack>
      )}
      {statusPassed(tx.status, 'success') && (
        <>
          {tx.continuation?.autoContinue && !contTx && (
            <Stack>
              <Text size="smallest" className={pendingClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoLoading />
                  Fetching proof
                </Stack>
              </Text>
            </Stack>
          )}
          {tx.continuation?.autoContinue && tx.continuation.proof && (
            <Stack>
              <Text size="smallest" className={successClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoCheck />
                  proof ready
                </Stack>
              </Text>
            </Stack>
          )}
          {contTx && statusPassed(contTx.status, 'preflight') && (
            <Stack>
              <Text size="smallest" className={successClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoCheck />
                  preflight continuation
                </Stack>
              </Text>
            </Stack>
          )}
          {contTx && statusPassed(contTx.status, 'submitted') && (
            <Stack>
              <Text size="smallest" className={successClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoCheck />
                  Send continuation
                </Stack>
              </Text>
            </Stack>
          )}
          {contTx && statusPassed(contTx.status, 'success') && (
            <Stack>
              <Text size="smallest" className={successClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoCheck />
                  Mined
                </Stack>
              </Text>
            </Stack>
          )}
          {contTx && contTx.status === 'failure' && (
            <Stack>
              <Text size="smallest" className={successClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoCheck />
                  Failed
                </Stack>
              </Text>
            </Stack>
          )}
        </>
      )}
      {tx.status === 'initiated' && (
        <>
          {'exec' in command.payload && (
            <>
              <Stack
                gap={'sm'}
                flexDirection={'column'}
                overflow="auto"
                flex={1}
              >
                <Value className={codeClass}>
                  <span title={command.payload.exec.code}>
                    {command.payload.exec.code}
                  </span>
                </Value>
              </Stack>
            </>
          )}
          {'cont' in command.payload && (
            <>
              <Stack gap={'sm'} flexDirection={'column'}>
                <Text>Continuation</Text>
                <Value>
                  {command.payload.cont.pactId}- step(
                  {command.payload.cont.step})
                </Value>
              </Stack>
            </>
          )}
          <Stack justifyContent={'space-between'} alignItems={'center'}>
            <Button isCompact onClick={onSign} variant="outlined">
              <Stack gap={'sm'} alignItems={'center'}>
                <MonoSignature scale={0.5} />
                Sign
              </Stack>
            </Button>
            <Button variant="transparent" isCompact onClick={onView}>
              Expand
            </Button>
          </Stack>
        </>
      )}
      {tx.status === 'signed' && (
        <>
          <Stack gap={'sm'} flexDirection={'column'} overflow="auto" flex={1}>
            <Value className={codeClass}>
              The transaction is Signed; you can now sent to to the blockchain
            </Value>
          </Stack>

          <Stack justifyContent={'space-between'} alignItems={'center'}>
            <Button isCompact variant="outlined">
              <Stack gap={'sm'} alignItems={'center'} onClick={onSubmit}>
                <MonoViewInAr />
                Send
              </Stack>
            </Button>
            <Button variant="transparent" isCompact onClick={onView}>
              Expand
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};
