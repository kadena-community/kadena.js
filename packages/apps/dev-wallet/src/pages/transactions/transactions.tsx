import { useNetwork } from '@/modules/network/network.hook';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IPactCommand } from '@kadena/client';
import { MonoOpenInNew } from '@kadena/kode-icons/system';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listClass, listItemClass, panelClass } from '../home/style.css';
import { hashStyle } from './style.css';

export function Transactions() {
  const { profile } = useWallet();
  const { activeNetwork } = useNetwork();
  const [transactions, setTransactions] = useState<
    (ITransaction & { creationDate: number })[]
  >([]);

  useEffect(() => {
    const run = async () => {
      if (profile?.uuid && activeNetwork?.networkId) {
        const txs = (
          await transactionRepository.getTransactionList(
            profile.uuid,
            activeNetwork?.networkId,
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
  }, [profile?.uuid, activeNetwork?.networkId]);

  return (
    <Box className={panelClass} marginBlockStart="xs">
      <Heading as="h4">Transactions</Heading>
      <Box marginBlockStart="md">
        {transactions.length ? (
          <ul className={listClass}>
            {transactions.map((tx) => (
              <li key={tx.uuid}>
                <Stack
                  justifyContent="space-between"
                  alignItems={'center'}
                  className={listItemClass}
                >
                  <Link to={`/transaction/${tx.groupId}`}>
                    <Text>
                      <MonoOpenInNew />
                    </Text>
                  </Link>
                  <Text className={hashStyle}>{tx.hash}</Text>
                  <Text className={hashStyle}>{tx.groupId}</Text>
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
    </Box>
  );
}
