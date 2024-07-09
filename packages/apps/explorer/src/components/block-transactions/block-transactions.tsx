import type { Transaction } from '@/__generated__/sdk';
import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import CompactTable from '../compact-table/compact-table';
import { FormatLink } from '../compact-table/utils/format-link';
import { FormatStatus } from '../compact-table/utils/format-status';
import { noTransactionsTitleClass } from './styles.css';

interface IProps {
  transactions: Transaction[];
  isLoading: boolean;
  totalCount: number;
  pageSize: number;
}

const BlockTransactions: FC<IProps> = ({
  transactions,
  isLoading,
  totalCount,
  pageSize,
}) => {
  if (!transactions.length) {
    return (
      <Stack
        flexDirection="column"
        width="100%"
        justifyContent="center"
        marginBlockStart="md"
        marginBlockEnd="xxxl"
      >
        <Heading as="h4" className={noTransactionsTitleClass}>
          There are no transactions in this block
        </Heading>
      </Stack>
    );
  }

  return (
    <CompactTable
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      fields={[
        {
          label: 'Status',
          key: 'result.goodResult',
          variant: 'code',
          width: '10%',
          render: FormatStatus(),
          loaderVariant: 'icon',
        },
        {
          label: 'Sender',
          key: 'cmd.meta.sender',
          variant: 'code',
          width: '25%',
          render: FormatLink({ appendUrl: '/account' }),
        },
        {
          label: 'RequestKey',
          key: 'hash',
          variant: 'code',
          width: '25%',
          render: FormatLink({ appendUrl: '/transaction' }),
        },
        {
          label: 'Code Preview',
          key: 'cmd.payload.code',
          variant: 'code',
          width: '40%',
        },
      ]}
      data={transactions}
    />
  );
};

export default BlockTransactions;
