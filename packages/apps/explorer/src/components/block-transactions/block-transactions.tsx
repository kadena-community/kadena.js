import type { BlockTransactionsQuery, Transaction } from '@/__generated__/sdk';
import { useBlockTransactionsQuery } from '@/__generated__/sdk';
import { usePagination } from '@/hooks/usePagination';
import { graphqlIdFor } from '@/utils/graphqlIdFor';
import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import CompactTable from '../compact-table/compact-table';
import { FormatLink } from '../compact-table/utils/format-link';
import { FormatStatus } from '../compact-table/utils/format-status';
import { loadingData } from './loading-data-blocktransactionsquery';
import { noTransactionsTitleClass } from './styles.css';

interface IProps {
  hash: string;
}

const BlockTransactions: FC<IProps> = ({ hash }) => {
  const id = graphqlIdFor('Block', hash);
  const [innerData, setInnerData] =
    useState<BlockTransactionsQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);

  const { variables, handlePageChange, pageSize } = usePagination({
    id,
  });

  const { loading, data } = useBlockTransactionsQuery({
    variables,
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);

        setInnerData(data);
      }, 200);
    }
  }, [loading, data]);

  if (innerData.node?.__typename !== 'Block') return null;

  if (!innerData.node?.transactions.edges.length) {
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
      setPage={handlePageChange}
      pageSize={pageSize}
      pageInfo={innerData.node!.transactions.pageInfo}
      totalCount={innerData.node!.transactions.totalCount}
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
      data={innerData.node.transactions.edges.map(
        (edge) => edge.node as Transaction,
      )}
    />
  );
};

export default BlockTransactions;
