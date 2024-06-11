import CompactTable from '@/components/compact-table/compact-table';
import type { ApolloError } from '@apollo/client';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { ISearchItem } from '../search';

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
  const data = useMemo(() => {
    return searchData
      .map((item) => {
        if (!item.data) return [];
        if (item.title === 'Account') {
          return [item.data?.fungibleAccount];
        }
        if (item.title === 'Block Height' || item.title === 'Block Hash') {
          return [item.data?.block];
        }
        if (item.title === 'Events') {
          return item.data.events.edges.map((edge: any) => {
            return edge.node;
          });
        }
        if (item.title === 'Request Key') {
          return item.data.transaction;
        }
      })
      .flat();
  }, [searchData]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {errors?.length > 0 && (
        <pre>Error: {JSON.stringify(errors, null, 2)}</pre>
      )}
      <section style={{ width: '100%' }}>
        {data && (
          <CompactTable
            fields={[
              {
                label: 'accountName',
                key: 'accountName',
                width: '50%',
              },
              {
                label: 'hash',
                key: 'hash',
                width: '50%',
              },
              {
                label: 'chainId',
                key: 'chainId',
                width: '50%',
              },
              {
                label: 'blockHeight',
                key: 'block.height',
                width: '50%',
              },
            ]}
            data={data}
          />
        )}
      </section>
    </>
  );
};

export default SearchResults;
