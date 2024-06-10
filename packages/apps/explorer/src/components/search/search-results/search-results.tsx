import CompactTable from '@/components/compact-table/compact-table';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { ISearchComponentProps } from '../search';

/**
 * because there are multiple row types.
 * we can either map the types to the same properties and use a compact table
 *
 * or we can use a normal table. check the row type and use the compactable field cell for that cell.
 *
 * */

const SearchResults: FC<ISearchComponentProps> = ({ searchItems }) => {
  console.log({ searchItems });
  const data = useMemo(() => {
    return searchItems;
  }, [searchItems]);
  return (
    <section style={{ width: '100%' }}>
      {searchItems && (
        <CompactTable
          fields={[
            {
              label: 'Title',
              key: 'title',
              width: '100%',
            },
          ]}
          data={data}
        />
      )}
    </section>
  );
};

export default SearchResults;
