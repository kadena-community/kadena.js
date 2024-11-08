import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { FormatCreationDateWrapper } from '@/Components/Table/FormatCreationDateWrapper';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { IPactCommand } from '@kadena/client';
import { MonoArrowOutward, MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { CompactTable, SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { codeClass } from './style.css';

export function Transactions() {
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
    <>
      <SideBarBreadcrumbs icon={<MonoSwapHoriz />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/transactions">
          Transactions
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack width="100%" flexDirection="column" gap="md">
        <Heading as="h4">Transactions</Heading>
        <TransactionList transactions={transactions} />
      </Stack>
    </>
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
            code: shortenPactCode(cmd.payload.exec.code, 4),
          };
        } else {
          return {
            ...tx,
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
            return (
              <Link
                to={`/transaction/${tx!.groupId}`}
                className={noStyleLinkClass}
                style={{ textDecoration: 'underline' }}
              >
                <Stack gap={'sm'} alignItems={'center'}>
                  {shorten(value)} <MonoArrowOutward fontSize={16} />
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
          key: 'cmd',
          variant: 'code',
          width: '20%',
          render: FormatCreationDateWrapper(),
        },
      ]}
      data={txs}
    />
  );
};
