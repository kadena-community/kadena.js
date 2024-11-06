import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { IPactCommand } from '@kadena/client';
import { MonoOpenInNew, MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listClass, listItemClass, panelClass } from '../home/style.css';
import { hashStyle } from './style.css';

export function Transactions() {
  useLayout({
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
      {txs.length ? (
        <ul className={listClass}>
          {txs.map((tx) => (
            <li key={tx.uuid}>
              <Stack
                justifyContent="space-between"
                alignItems={'center'}
                className={listItemClass}
                gap={'lg'}
              >
                <Link to={`/transaction/${tx.groupId}`}>
                  <Text>
                    <MonoOpenInNew />
                  </Text>
                </Link>
                <Text>{shorten(tx.hash)}</Text>

                <Text className={hashStyle}>
                  <span
                    title={tx.type === 'exec' ? tx.code : `cont: ${tx.code}`}
                  >
                    {tx.type === 'exec' ? tx.code : `cont: ${tx.code}`}
                  </span>
                </Text>

                <Text>{tx.status}</Text>

                <Text>
                  {new Date(
                    ((JSON.parse(tx.cmd) as IPactCommand).meta.creationTime ||
                      0) * 1000,
                  ).toLocaleString()}
                </Text>
              </Stack>
            </li>
          ))}
        </ul>
      ) : null}
    </Box>
  );
};
