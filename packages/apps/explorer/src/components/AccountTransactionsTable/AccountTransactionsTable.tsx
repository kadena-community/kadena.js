import type {
  AccountTransactionsQuery,
  Transaction,
} from '@/__generated__/sdk';
import { useAccountTransactionsQuery } from '@/__generated__/sdk';
import { useQueryContext } from '@/context/queryContext';
import { graphqlIdFor } from '@/utils/graphqlIdFor';
import { Heading, Stack } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  usePagination,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { FormatLinkWrapper } from '../CompactTable/FormatLinkWrapper';
import { useToast } from '../Toast/ToastContext/ToastContext';
import { accountTransactions } from './AccountTransactions.graph';
import { loadingData } from './loadingDataAccountTransactionsquery';

export const AccountTransactionsTable: FC<{ accountName: string }> = ({
  accountName,
}) => {
  const id = graphqlIdFor('FungibleAccount', `["coin", "${accountName}"]`);
  const [innerData, setInnerData] =
    useState<AccountTransactionsQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueries } = useQueryContext();

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

  useEffect(() => {
    if (accountName) {
      setQueries([{ query: accountTransactions, variables }]);
    }
  }, [accountName]);

  if (innerData.node?.__typename !== 'FungibleAccount') return null;

  if (error)
    return (
      <Stack justifyContent="center">
        <Heading as="h5">There was an issue with loading the results</Heading>
      </Stack>
    );

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
          render: CompactTableFormatters.FormatStatus(),
        },
        {
          label: 'Sender',
          key: 'cmd.meta.sender',
          variant: 'code',
          width: '25%',
          render: FormatLinkWrapper({ url: '/account/:value' }),
        },
        {
          label: 'RequestKey',
          key: 'hash',
          variant: 'code',
          width: '25%',
          render: FormatLinkWrapper({ url: '/transaction/:value' }),
        },
        {
          label: 'Code Preview',
          key: 'cmd.payload.code',
          variant: 'code',
          width: '40%',
          render: CompactTableFormatters.FormatJsonParse(),
        },
      ]}
      data={innerData.node!.transactions.edges.map(
        (edge) => edge.node as Transaction,
      )}
    />
  );
};
