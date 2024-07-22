import type { Transaction } from '@/__generated__/sdk';
import { CompactTable } from '@/components/CompactTable/CompactTable';
import { FormatAmount } from '@/components/CompactTable/utils/formatAmount';
import {
  FormatJsonParse,
  FormatLink,
} from '@/components/CompactTable/utils/formatLink';
import { FormatStatus } from '@/components/CompactTable/utils/formatStatus';
import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import type { ApolloError } from '@apollo/client';
import type { FC } from 'react';
import React from 'react';
import { NoSearchResults } from '../NoSearchResults/NoSearchResults';
import type { ISearchItem } from '../SearchComponent/SearchComponent';
import { loadingData } from './../loadingDataSearch';

export interface ISearchResultsProps {
  searchData: ISearchItem[];
  loading: boolean;
  errors: ApolloError[];
}

export const SearchResults: FC<ISearchResultsProps> = ({
  searchData,
  loading,
}) => {
  return (
    <>
      <section style={{ width: '100%' }}>
        {loading ? (
          <CompactTable
            isLoading={true}
            fields={[
              {
                label: '-',
                key: 'result.goodResult',
                variant: 'code',
                width: '10%',
              },
              {
                label: '-',
                key: 'cmd.meta.sender',
                variant: 'code',
                width: '25%',
              },
              {
                label: '-',
                key: 'hash',
                variant: 'code',
                width: '25%',
              },
              {
                label: '-',
                key: 'cmd.payload.code',
                variant: 'code',
                width: '40%',
              },
            ]}
            data={
              loadingData.node?.__typename === 'FungibleAccount'
                ? loadingData.node!.transactions.edges.map(
                    (edge) => edge.node as Transaction,
                  )
                : []
            }
          />
        ) : (
          <>
            <NoSearchResults searchData={searchData} />
            {searchData[SearchOptionEnum.ACCOUNT].data?.length > 0 && (
              <CompactTable
                fields={[
                  {
                    label: 'Account',
                    key: 'accountName',
                    width: '20%',
                    render: FormatLink({ appendUrl: '/account' }),
                  },
                  {
                    label: 'Key',
                    key: 'key',
                    width: '20%',
                  },
                  {
                    label: 'Predicate',
                    key: 'predicate',
                    width: '20%',
                  },
                  {
                    label: 'Chains',
                    key: 'chains',
                    width: '20%',
                  },
                ]}
                data={Object.values(searchData[SearchOptionEnum.ACCOUNT].data)}
              />
            )}

            {searchData[SearchOptionEnum.BLOCKHEIGHT].data?.blocksFromHeight
              ?.edges?.length && (
              <CompactTable
                fields={[
                  {
                    label: 'ChainId',
                    key: 'node.chainId',
                    width: '20%',
                  },
                  {
                    label: 'Height',
                    key: 'node.height',
                    width: '20%',
                  },
                  {
                    label: 'Hash',
                    key: 'node.hash',
                    width: '60%',
                    render: FormatLink({ appendUrl: '/block' }),
                  },
                ]}
                data={
                  searchData[SearchOptionEnum.BLOCKHEIGHT].data
                    ?.blocksFromHeight.edges
                }
              />
            )}
            {searchData[SearchOptionEnum.BLOCKHASH].data?.block && (
              <CompactTable
                fields={[
                  {
                    label: 'ChainId',
                    key: 'chainId',
                    width: '20%',
                  },
                  {
                    label: 'Height',
                    key: 'height',
                    width: '20%',
                  },
                  {
                    label: 'Hash',
                    key: 'hash',
                    width: '60%',
                    render: FormatLink({ appendUrl: '/block' }),
                  },
                ]}
                data={[searchData[SearchOptionEnum.BLOCKHASH].data?.block]}
              />
            )}

            {searchData[SearchOptionEnum.REQUESTKEY].data?.transaction && (
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
                data={[
                  searchData[SearchOptionEnum.REQUESTKEY].data?.transaction,
                ]}
              />
            )}

            {searchData[SearchOptionEnum.EVENT].data?.events?.edges?.length >
              0 && (
              <CompactTable
                fields={[
                  {
                    label: 'ChainId',
                    key: 'node.chainId',
                    width: '20%',
                  },
                  {
                    label: 'Height',
                    key: 'node.block.height',
                    width: '20%',
                  },
                  {
                    label: 'RequestKey',
                    key: 'node.requestKey',
                    width: '20%',
                    render: FormatLink({ appendUrl: '/transaction' }),
                  },
                  {
                    label: 'Parameters',
                    key: 'node.parameters',
                    width: '40%',
                  },
                ]}
                data={searchData[SearchOptionEnum.EVENT].data?.events.edges}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};
