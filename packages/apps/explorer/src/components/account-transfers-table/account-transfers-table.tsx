import type { AccountTransfersQuery, Transfer } from '@/__generated__/sdk';
import { useAccountTransfersQuery } from '@/__generated__/sdk';
import { usePagination } from '@/hooks/usePagination';
import { graphqlIdFor } from '@/utils/graphqlIdFor';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import CompactTable from '../compact-table/compact-table';
import { FormatAmount } from '../compact-table/utils/format-amount';
import { FormatLink } from '../compact-table/utils/format-link';
import { useToast } from '../toasts/toast-context/toast-context';
import { loadingData } from './loading-data-account-transfersquery';

const AccountTransfersTable: FC<{ accountName: string }> = ({
  accountName,
}) => {
  const id = graphqlIdFor('FungibleAccount', `["coin", "${accountName}"]`);
  const [innerData, setInnerData] =
    useState<AccountTransfersQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);

  const { variables, handlePageChange, pageSize } = usePagination({
    id,
  });
  const { addToast } = useToast();
  const { data, loading, error } = useAccountTransfersQuery({
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
        body: 'Loading of account transfers failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);

        setInnerData(data);
      }, 200);
    }
  }, [loading, data]);

  if (innerData.node?.__typename !== 'FungibleAccount') return null;

  return (
    <CompactTable
      setPage={handlePageChange}
      pageSize={pageSize}
      pageInfo={innerData.node!.transfers.pageInfo}
      totalCount={innerData.node!.transfers.totalCount}
      isLoading={isLoading}
      fields={[
        {
          label: 'ChainId',
          key: 'chainId',
          variant: 'code',
          width: '10%',
        },
        {
          label: 'Height',
          key: 'height',
          variant: 'code',
          width: '10%',
        },
        {
          label: 'RequestKey',
          key: 'requestKey',
          width: '20%',
          render: FormatLink({ appendUrl: '/transaction' }),
        },
        {
          label: 'Sender',
          key: 'senderAccount',
          width: '20%',
          render: FormatLink({ appendUrl: '/account' }),
        },
        {
          label: 'Receiver',
          key: 'receiverAccount',
          width: '20%',
          render: FormatLink({ appendUrl: '/account' }),
        },
        {
          label: 'Amount',
          key: 'amount',
          variant: 'code',
          align: 'end',
          width: '20%',
          render: FormatAmount(),
        },
      ]}
      data={innerData.node?.transfers.edges.map(
        (edge) => edge.node as Transfer,
      )}
    />
  );
};

export default AccountTransfersTable;
