import type {
  AccountTransactionsQuery,
  Transaction,
} from '@/__generated__/sdk';
import { useAccountTransactionsQuery } from '@/__generated__/sdk';
import { usePagination } from '@/hooks/usePagination';
import { graphqlIdFor } from '@/utils/graphqlIdFor';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { FormatJsonParse, FormatLink } from '../CompactTable/utils/formatLink';

import { CompactTable } from '../CompactTable/CompactTable';
import { FormatStatus } from '../CompactTable/utils/formatStatus';
import { useToast } from '../Toasts/ToastContext/ToastContext';
import { loadingData } from './loadingDataAccountTransactionsquery';

export const AccountTransactionsTable: FC<{ accountName: string }> = ({
  accountName,
}) => {
  const id = graphqlIdFor('FungibleAccount', `["coin", "${accountName}"]`);
  const [innerData, setInnerData] =
    useState<AccountTransactionsQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);

  const { variables, handlePageChange, pageSize } = usePagination({
    id,
  });

  const { addToast } = useToast();
  const { data, loading, error } = useAccountTransactionsQuery({
    variables,
    skip: !id,
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of account transactions failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);

        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

  if (innerData.node?.__typename !== 'FungibleAccount') return null;

  return (
    <CompactTable
      setPage={handlePageChange}
      pageSize={pageSize}
      pageInfo={innerData.node!.transactions.pageInfo}
      totalCount={innerData.node!.transactions.totalCount}
      isLoading={isLoading}
      label="Keys table"
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
          render: FormatJsonParse(),
        },
      ]}
      data={innerData.node!.transactions.edges.map(
        (edge) => edge.node as Transaction,
      )}
    />
  );
};
