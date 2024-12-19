import { ITransaction } from '@/modules/transaction/transaction.repository';
import { shorten, toISOLocalDateTime } from '@/utils/helpers';
import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { IContinuationPayloadObject, IPactCommand } from '@kadena/client';
import { Stack, Text } from '@kadena/kode-ui';
import { CompactTable } from '@kadena/kode-ui/patterns';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { codeClass } from './style.css';

export const TransactionList = ({
  transactions,
}: {
  transactions: ITransaction[];
}) => {
  const txs = useMemo(
    () =>
      transactions
        .filter(
          (tx, _idx, list) =>
            list.findIndex(
              (t) => t.continuation?.continuationTxId === tx.uuid,
            ) < 0,
        )
        .map((tx) => {
          const cmd = JSON.parse(tx.cmd) as IPactCommand;
          const continuation = transactions.find(
            ({ uuid }) => tx?.continuation?.continuationTxId === uuid,
          );
          const contCmd = continuation
            ? (JSON.parse(continuation?.cmd) as IPactCommand)
            : undefined;
          if ('exec' in cmd.payload) {
            const code = shortenPactCode(cmd.payload.exec.code, {
              shortening: 6,
              withIndent: 0,
              breakLines: false,
            });
            return {
              ...tx,
              type: 'exec',
              status: [tx.status, continuation?.status]
                .filter(Boolean)
                .join('\n'),
              creationTime: contCmd
                ? [cmd.meta.creationTime, contCmd.meta.creationTime]
                : cmd.meta.creationTime,
              code: contCmd
                ? `exec:${code}\ncont: ${(contCmd.payload as IContinuationPayloadObject).cont.pactId}`
                : code,
            };
          } else {
            return {
              ...tx,
              creationTime: cmd.meta.creationTime,
              type: 'cont',
              code: `cont: ${cmd.payload.cont.pactId}`,
            };
          }
        }),
    [transactions],
  );
  return (
    <CompactTable
      fields={[
        {
          label: 'Hash',
          key: 'hash',
          variant: 'body',
          width: '15%',
          render: ({ value }) => {
            const tx = txs.find((tx) => tx.hash === value);
            const continuation = transactions.find(
              ({ uuid }) => tx?.continuation?.continuationTxId === uuid,
            );
            return (
              <Link
                to={`/transaction/${tx!.uuid}`}
                className={noStyleLinkClass}
                style={{ textDecoration: 'underline' }}
              >
                <Stack
                  gap={'sm'}
                  alignItems={'center'}
                  flexDirection={'column'}
                >
                  <Text>{shorten(value)}</Text>
                  {continuation && <Text>{shorten(continuation.hash)}</Text>}
                </Stack>
              </Link>
            );
          },
        },
        {
          label: 'Status',
          key: 'status',
          variant: 'code',
          width: '15%',
          render: ({ value }) => (
            <Text variant="code" className={codeClass}>
              {value}
            </Text>
          ),
        },
        {
          label: 'Code',
          key: 'code',
          variant: 'code',
          width: 'auto',
          render: ({ value }) => (
            <Text variant="code" className={codeClass}>
              {value}
            </Text>
          ),
        },
        {
          label: 'Date',
          key: 'creationTime',
          variant: 'code',
          width: '20%',
          render: ({ value }) => (
            <Text variant="code" className={codeClass}>
              {renderTimes(value)}
            </Text>
          ),
        },
      ]}
      data={txs}
    />
  );
};

const renderTimes = (value: string | string[]) => {
  const times =
    typeof value === 'string' || typeof value === 'number' ? [value] : value;
  return times.map((time) => toISOLocalDateTime(+time * 1000)).join('\n');
};
