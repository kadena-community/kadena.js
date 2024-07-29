import type { Transaction } from '@/__generated__/sdk';
import { CompactTable } from '@/components/CompactTable/CompactTable';
import {
  FormatJsonParse,
  FormatLink,
} from '@/components/CompactTable/utils/formatLink';
import { FormatStatus } from '@/components/CompactTable/utils/formatStatus';
import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import type { FC } from 'react';
import React from 'react';
import { NoSearchResults } from '../NoSearchResults/NoSearchResults';
import type { ISearchItem } from '../SearchComponent/SearchComponent';
import { loadingData } from './../loadingDataSearch';

export interface ISearchResultsProps {
  searchData: ISearchItem[];
  loading: boolean;
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
          </>
        )}
      </section>
    </>
  );
};
