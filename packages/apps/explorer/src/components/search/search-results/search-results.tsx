import CompactTable from '@/components/compact-table/compact-table';
import { FormatAmount } from '@/components/compact-table/utils/format-amount';
import { FormatLink } from '@/components/compact-table/utils/format-link';
import { FormatStatus } from '@/components/compact-table/utils/format-status';
import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import type { ApolloError } from '@apollo/client';
import type { FC } from 'react';
import React from 'react';
import type { ISearchItem } from '../search-component/search-component';

export interface ISearchResultsProps {
  searchData: ISearchItem[];
  loading: boolean;
  errors: ApolloError[];
}

const SearchResults: FC<ISearchResultsProps> = ({
  searchData,
  loading,
  errors,
}) => {
  return (
    <>
      {loading && <div>Loading...</div>}
      {errors?.length > 0 && (
        <pre>Error: {JSON.stringify(errors, null, 2)}</pre>
      )}

      <section style={{ width: '100%' }}>
        {searchData[SearchOptionEnum.ACCOUNT].data.length > 0 && (
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

              {
                label: 'Balance',
                key: 'balance',
                width: '20%',
                render: FormatAmount(),
              },
            ]}
            data={Object.values(searchData[SearchOptionEnum.ACCOUNT].data)}
          />
        )}

        {searchData[SearchOptionEnum.BLOCKHEIGHT].data?.blocksFromHeight && (
          <CompactTable
            fields={[
              {
                label: 'ChainId',
                key: 'node.chainId',
                width: '20%',
              },
              {
                label: 'Block Height',
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
              searchData[SearchOptionEnum.BLOCKHEIGHT].data?.blocksFromHeight
                .edges
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
                label: 'Block Height',
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
              },
            ]}
            data={[searchData[SearchOptionEnum.REQUESTKEY].data?.transaction]}
          />
        )}

        {searchData[SearchOptionEnum.EVENT].data?.events.edges?.length > 0 && (
          <CompactTable
            fields={[
              {
                label: 'ChainId',
                key: 'node.chainId',
                width: '20%',
              },
              {
                label: 'Block Height',
                key: 'node.block.height',
                width: '20%',
              },
              {
                label: 'RequestKey',
                key: 'node.requestKey',
                width: '20%',
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
      </section>
    </>
  );
};

export default SearchResults;
