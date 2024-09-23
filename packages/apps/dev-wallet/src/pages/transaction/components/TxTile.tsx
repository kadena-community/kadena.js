import {
  ITransaction,
  transactionRepository,
  TransactionStatus,
} from '@/modules/transaction/transaction.repository';

import { shorten } from '@/utils/helpers';
import {
  MonoBrightness1,
  MonoCheck,
  MonoClose,
  MonoLoading,
  MonoOpenInFull,
  MonoSignature,
  MonoViewInAr,
} from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';

import classNames from 'classnames';

import { IPactCommand } from '@kadena/client';

import { useAsync } from '@/utils/useAsync';
import { Value } from './helpers';
import {
  codeClass,
  failureClass,
  pendingClass,
  successClass,
  txTileClass,
  txTileContentClass,
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
  sendDisabled,
}: {
  tx: ITransaction;
  onSign: () => void;
  onSubmit: () => Promise<ITransaction>;
  onView: () => void;
  sendDisabled?: boolean;
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
  const getStatusClass = (status: ITransaction['status']) => {
    if (statusPassed(status, 'success')) return successClass;
    if (status === 'failure') return failureClass;
    if (status === 'initiated') return '';
    return pendingClass;
  };
  return (
    <Stack
      flexDirection={'column'}
      justifyContent={'space-between'}
      className={txTileClass}
      gap={'sm'}
    >
      <Stack flexDirection={'column'} gap={'sm'} flex={1}>
        <Stack justifyContent={'space-between'}>
          <Text>
            {tx.continuation?.autoContinue ? 'exec' : 'hash'}:{' '}
            {shorten(tx.hash, 6)}
          </Text>
          <MonoBrightness1 className={classNames(getStatusClass(tx.status))} />
        </Stack>
        {!contTx && statusPassed(tx.status, 'signed') && (
          <Stack>
            <Text size="smallest" className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                Signed
              </Stack>
            </Text>
          </Stack>
        )}
        {!contTx && statusPassed(tx.status, 'preflight') && (
          <Stack>
            <Text size="smallest" className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                preflight
              </Stack>
            </Text>
          </Stack>
        )}
        {!contTx && statusPassed(tx.status, 'submitted') && (
          <Stack>
            <Text size="smallest" className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                Send
              </Stack>
            </Text>
          </Stack>
        )}
        {!contTx &&
          statusPassed(tx.status, 'submitted') &&
          (!('result' in tx) || !tx.result) && (
            <Stack>
              <Text size="smallest" className={pendingClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoLoading />
                  Mining...
                </Stack>
              </Text>
            </Stack>
          )}
        {statusPassed(tx.status, 'success') && (
          <Stack>
            <Text size="smallest" className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                Mined{' '}
                {tx.continuation?.autoContinue && contTx
                  ? `in chain ${tx.purpose!.data.source as string}`
                  : ''}
              </Stack>
            </Text>
          </Stack>
        )}
        {tx.status === 'failure' && (
          <Stack>
            <Text size="smallest" className={failureClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoClose />
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
                    proof fetched
                  </Stack>
                </Text>
              </Stack>
            )}
            {contTx && (
              <>
                <Stack justifyContent={'space-between'}>
                  <Text>cont: {shorten(contTx.hash, 6)}</Text>
                  <MonoBrightness1
                    className={classNames(getStatusClass(contTx.status))}
                  />
                </Stack>
                {statusPassed(contTx.status, 'preflight') && (
                  <Stack>
                    <Text size="smallest" className={successClass}>
                      <Stack alignItems={'center'} gap={'xs'}>
                        <MonoCheck />
                        preflight
                      </Stack>
                    </Text>
                  </Stack>
                )}
                {statusPassed(contTx.status, 'submitted') && (
                  <Stack>
                    <Text size="smallest" className={successClass}>
                      <Stack alignItems={'center'} gap={'xs'}>
                        <MonoCheck />
                        Send
                      </Stack>
                    </Text>
                  </Stack>
                )}
                {statusPassed(contTx.status, 'submitted') &&
                  (!('result' in contTx) || !contTx.result) && (
                    <Stack>
                      <Text size="smallest" className={pendingClass}>
                        <Stack alignItems={'center'} gap={'xs'}>
                          <MonoLoading />
                          Mining...
                        </Stack>
                      </Text>
                    </Stack>
                  )}
                {statusPassed(contTx.status, 'success') && (
                  <Stack>
                    <Text size="smallest" className={successClass}>
                      <Stack alignItems={'center'} gap={'xs'}>
                        <MonoCheck />
                        Mined
                      </Stack>
                    </Text>
                  </Stack>
                )}
                {contTx.status === 'failure' && (
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
                  className={txTileContentClass}
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
          </>
        )}
        {tx.status === 'signed' && (
          <>
            <Stack
              gap={'sm'}
              flexDirection={'column'}
              overflow="auto"
              flex={1}
              justifyContent={'flex-end'}
              paddingBlockEnd={'sm'}
            >
              <Text size="small">
                The transaction is Signed; you can now sent to to the blockchain
              </Text>
            </Stack>
          </>
        )}
      </Stack>
      <Stack justifyContent={'space-between'} alignItems={'center'}>
        <Stack alignItems={'center'}>
          {tx.status === 'initiated' && (
            <Button isCompact onClick={onSign} variant="outlined">
              <Stack gap={'sm'} alignItems={'center'}>
                <MonoSignature scale={0.5} />
                Sign
              </Stack>
            </Button>
          )}
          {tx.status === 'signed' && !sendDisabled && (
            <Button isCompact variant="outlined">
              <Stack gap={'sm'} alignItems={'center'} onClick={onSubmit}>
                <MonoViewInAr />
                Send
              </Stack>
            </Button>
          )}
        </Stack>
        <Button variant="outlined" isCompact onClick={onView}>
          <Stack gap={'sm'} alignItems={'center'}>
            <MonoOpenInFull />
            Expand
          </Stack>
        </Button>
      </Stack>
    </Stack>
  );
};
