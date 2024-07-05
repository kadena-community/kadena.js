import type { Transaction } from '@/__generated__/sdk';
import type { FC } from 'react';
import React from 'react';
import CompactTable from '../compact-table/compact-table';
import { FormatLink } from '../compact-table/utils/format-link';
import { FormatStatus } from '../compact-table/utils/format-status';

interface IProps {
  transactions: Transaction[];
}

const BlockTransactions: FC<IProps> = ({ transactions }) => {
  return (
    <CompactTable
      fields={[
        {
          label: 'Status',
          key: 'result.goodResult',
          variant: 'code',
          width: '10%',
          render: FormatStatus(),
        },
        {
          label: 'Sender',
          key: 'cmd.meta.sender',
          variant: 'code',
          width: '25%',
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
