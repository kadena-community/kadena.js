import { FormatCreationDateWrapper } from '@/Components/Table/FormatCreationDateWrapper';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';

import { FormatHash } from '@/Components/Table/FormatHash';
import { IPactCommand } from '@kadena/client';
import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  useLayout,
} from '@kadena/kode-ui/patterns';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listClass, listItemClass, panelClass } from '../home/style.css';
import { hashStyle } from './style.css';

export function Transactions() {
  useLayout({
    appContext: undefined,
    breadCrumbs: [
      {
        label: 'Transactions',
        visual: <MonoSwapHoriz />,
        url: '/transactions',
      },
    ],
  });
  const { profile, activeNetwork } = useWallet();
  const [transactions, setTransactions] = useState<
    (ITransaction & { creationDate: number })[]
  >([]);

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
    };
    run();
  }, [profile?.uuid, activeNetwork?.uuid]);

  return (
    <Box className={panelClass} marginBlockStart="xs">
      <Heading as="h4">Transactions</Heading>
      <TransactionList transactions={transactions} />
    </Box>
  );
}

export const TransactionList = ({
  transactions,
}: {
  transactions: ITransaction[];
}) => {
  const txs = useMemo(
    () =>
      transactions.map((tx) => {
        const cmd = JSON.parse(tx.cmd) as IPactCommand;
        if ('exec' in cmd.payload) {
          return {
            ...tx,
            type: 'exec',
            code: cmd.payload.exec.code,
          };
        } else {
          return {
            ...tx,
            type: 'cont',
            code: cmd.payload.cont.pactId,
          };
        }
      }),
    [transactions],
  );
  return (
    <Box marginBlockStart="md">
      <CompactTable
        fields={[
          {
            label: 'Status',
            key: 'status',
            variant: 'code',
            width: '10%',
            render: CompactTableFormatters.FormatStatus(),
          },
          {
            label: 'GroupId',
            key: 'groupId',
            variant: 'code',
            width: '30%',
            render: CompactTableFormatters.FormatLinkWrapper({
              url: '/transaction/:value',
              linkComponent: Link,
            }),
          },
          {
            label: 'Hash',
            key: 'hash',
            variant: 'code',
            width: '20%',
            render: FormatHash(),
          },
          {
            label: 'Date',
            key: 'cmd',
            variant: 'code',
            width: '40%',
            render: FormatCreationDateWrapper(),
          },
        ]}
        data={txs}
      />
    </Box>
  );
};
