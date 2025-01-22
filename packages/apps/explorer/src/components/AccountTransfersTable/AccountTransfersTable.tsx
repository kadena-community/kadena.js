import type { AccountTransfersQuery, Transfer } from '@/__generated__/sdk';
import { useAccountTransfersQuery } from '@/__generated__/sdk';
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
import { accountTransfers } from './AccountTransfers.graph';
import { loadingData } from './loadingDataAccountTransfersquery';

export const AccountTransfersTable: FC<{ accountName: string }> = ({
  accountName,
}) => {
  const id = graphqlIdFor('FungibleAccount', `["coin", "${accountName}"]`);
  const [innerData, setInnerData] =
    useState<AccountTransfersQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueries } = useQueryContext();

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

  useEffect(() => {
    if (id) {
      setQueries([{ query: accountTransfers, variables }]);
    }
  }, [id]);

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
      pageInfo={innerData.node!.transfers.pageInfo}
      isLoading={isLoading}
      fields={[
        {
          label: 'ChainId',
          key: 'block.chainId',
          variant: 'code',
          width: '10%',
        },
        {
          label: 'Height',
          key: 'block.height',
          variant: 'code',
          width: '10%',
        },
        {
          label: 'RequestKey',
          key: 'transaction.hash',
          width: '20%',
          render: FormatLinkWrapper({ url: '/transaction/:value' }),
        },
        {
          label: 'Sender',
          key: 'senderAccount',
          width: '20%',
          render: FormatLinkWrapper({ url: '/account/:value' }),
        },
        {
          label: 'Receiver',
          key: 'receiverAccount',
          width: '20%',
          render: FormatLinkWrapper({ url: '/account/:value' }),
        },
        {
          label: 'Amount',
          key: 'amount',
          variant: 'code',
          align: 'end',
          width: '20%',
          render: CompactTableFormatters.FormatAmount(),
        },
      ]}
      data={innerData.node?.transfers.edges
        .map((edge) => edge.node as Transfer)
        .map((transfer) => ({
          ...transfer,
          senderAccount:
            transfer.senderAccount.length === 0 ? 'Coinbase' : transfer.senderAccount,
          transaction: {
            ...transfer.transaction,
            hash: transfer.transaction?.hash ?? 'Mining reward',
          },
        }))}
    />
  );
};
