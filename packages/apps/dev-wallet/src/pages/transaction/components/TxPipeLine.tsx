import {
  ITransaction,
  transactionRepository,
  TransactionStatus,
} from '@/modules/transaction/transaction.repository';
import { shorten } from '@/utils/helpers';
import { useAsync } from '@/utils/useAsync';
import {
  MonoBrightness1,
  MonoCheck,
  MonoClose,
  MonoLoading,
} from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import { failureClass, pendingClass, successClass } from './style.css';

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

export const getStatusClass = (status: ITransaction['status']) => {
  if (statusPassed(status, 'success')) return successClass;
  if (status === 'failure') return failureClass;
  if (status === 'initiated') return '';
  return pendingClass;
};

export function TxPipeLine({
  tx,
  variant,
}: {
  tx: ITransaction;
  variant: 'tile' | 'expanded';
}) {
  const textSize = variant === 'tile' ? 'smallest' : 'base';
  const [contTx] = useAsync(
    (transaction) =>
      transaction.continuation?.continuationTxId
        ? transactionRepository.getTransaction(
            transaction.continuation?.continuationTxId,
          )
        : Promise.resolve(null),
    [tx],
  );
  return (
    <Stack flexDirection={'column'}>
      {!contTx && statusPassed(tx.status, 'signed') && (
        <Stack>
          <Text size={textSize} className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              Signed
            </Stack>
          </Text>
        </Stack>
      )}
      {!contTx && statusPassed(tx.status, 'preflight') && (
        <Stack>
          <Text size={textSize} className={successClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoCheck />
              preflight
            </Stack>
          </Text>
        </Stack>
      )}
      {!contTx && statusPassed(tx.status, 'submitted') && (
        <Stack>
          <Text size={textSize} className={successClass}>
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
            <Text size={textSize} className={pendingClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoLoading />
                Mining...
              </Stack>
            </Text>
          </Stack>
        )}
      {statusPassed(tx.status, 'success') && (
        <Stack>
          <Text size={textSize} className={successClass}>
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
          <Text size={textSize} className={failureClass}>
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
              <Text size={textSize} className={pendingClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoLoading />
                  Fetching proof
                </Stack>
              </Text>
            </Stack>
          )}
          {tx.continuation?.autoContinue && tx.continuation.proof && (
            <Stack>
              <Text size={textSize} className={successClass}>
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
                  <Text size={textSize} className={successClass}>
                    <Stack alignItems={'center'} gap={'xs'}>
                      <MonoCheck />
                      preflight
                    </Stack>
                  </Text>
                </Stack>
              )}
              {statusPassed(contTx.status, 'submitted') && (
                <Stack>
                  <Text size={textSize} className={successClass}>
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
                    <Text size={textSize} className={pendingClass}>
                      <Stack alignItems={'center'} gap={'xs'}>
                        <MonoLoading />
                        Mining...
                      </Stack>
                    </Text>
                  </Stack>
                )}
              {statusPassed(contTx.status, 'success') && (
                <Stack>
                  <Text size={textSize} className={successClass}>
                    <Stack alignItems={'center'} gap={'xs'}>
                      <MonoCheck />
                      Mined
                    </Stack>
                  </Text>
                </Stack>
              )}
              {contTx.status === 'failure' && (
                <Stack>
                  <Text size={textSize} className={successClass}>
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
    </Stack>
  );
}
