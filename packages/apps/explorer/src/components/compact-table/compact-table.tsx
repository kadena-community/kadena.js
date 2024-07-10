import { Media } from '@/components/layout/media';
import React from 'react';
import { fullWidthClass } from '../globalstyles.css';
import type { ITableField } from '../loading-skeleton/types';
import CompactTableDesktop from './compact-table-desktop/compact-table-desktop';
import CompactTableMobile from './compact-table-mobile/compact-table-mobile';
import type { ITablePaginationPageOptions } from './table-pagination/table-pagination';
import TablePagination from './table-pagination/table-pagination';

export interface ICompactTableProps {
  label?: string;
  data: any[];
  fields: ITableField[];
  isLoading?: boolean;
  totalCount?: number;
  pageSize?: number;
  setPage?: (page: ITablePaginationPageOptions) => void;
  pageInfo?: {
    endCursor?: string | null;
    startCursor?: string | null;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

const CompactTable: React.FC<ICompactTableProps> = ({
  fields,
  data,
  label,
  isLoading = false,
  totalCount,
  pageSize,
  setPage,
  pageInfo,
}) => {
  return (
    <>
      {setPage && pageInfo && totalCount && pageSize && (
        <TablePagination
          totalCount={totalCount}
          pageSize={pageSize}
          setPage={setPage}
          pageInfo={pageInfo}
        />
      )}
      <Media lessThan="sm">
        <CompactTableMobile isLoading={isLoading} fields={fields} data={data} />
      </Media>
      <Media greaterThanOrEqual="sm" className={fullWidthClass}>
        <CompactTableDesktop
          isLoading={isLoading}
          fields={fields}
          data={data}
          label={label}
        />
      </Media>
    </>
  );
};
export default CompactTable;
