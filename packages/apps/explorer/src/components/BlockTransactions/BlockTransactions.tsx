import type { BlockTransactionsQuery, Transaction } from '@/__generated__/sdk';
import { useBlockTransactionsQuery } from '@/__generated__/sdk';
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
import { loadingData } from './loadingDataBlocktransactionsquery';
import { noTransactionsTitleClass } from './styles.css';

interface IProps {
  hash: string;
}

export const BlockTransactions: FC<IProps> = ({ hash }) => {
  const id = graphqlIdFor('Block', hash);
  const [innerData, setInnerData] =
    useState<BlockTransactionsQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);

  const { variables, handlePageChange, pageSize } = usePagination({
    id,
  });

  const { addToast } = useToast();
  const { loading, data, error } = useBlockTransactionsQuery({
    variables,
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
        body: 'Loading of block transactions failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);

        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

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
          key: ['result.goodResult', 'result.continuation'],
          variant: 'code',
          width: '10%',
          render: [
            CompactTableFormatters.FormatStatus(),
            CompactTableFormatters.FormatMultiStepTx(),
          ],
          loaderVariant: 'icon',
        },
        {
          label: 'Request Key',
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
        {
          label: 'Sender',
          key: 'cmd.meta.sender',
          variant: 'code',
          width: '25%',
          render: FormatLinkWrapper({ url: '/account/:value' }),
        },
      ]}
      data={innerData.node.transactions.edges.map(
        (edge) => edge.node as Transaction,
      )}
    />
  );
};
