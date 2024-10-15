import React from 'react';
import { Media } from './../../components/Media';
import { DataTableDesktop } from './DataTableDesktop/DataTableDesktop';
import { DataTableMobile } from './DataTableMobile/DataTableMobile';
import type { ITableField } from './LoadingSkeleton/types';
import type { ITablePaginationPageOptions } from './TablePagination/TablePagination';
import { TablePagination } from './TablePagination/TablePagination';
import { fullWidthClass } from './styles.css';

export interface IDataTableProps {
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

export const DataTable: React.FC<IDataTableProps> = ({
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
      <Media lessThan="sm" className={fullWidthClass}>
        <DataTableMobile isLoading={isLoading} fields={fields} data={data} />
      </Media>
      <Media greaterThanOrEqual="sm" className={fullWidthClass}>
        <DataTableDesktop
          isLoading={isLoading}
          fields={fields}
          data={data}
          label={label}
        />
      </Media>
      {!!(setPage && pageInfo && totalCount && pageSize) && (
        <TablePagination
          totalCount={totalCount}
          pageSize={pageSize}
          setPage={setPage}
          pageInfo={pageInfo}
        />
      )}
    </>
  );
};
