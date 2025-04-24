import React from 'react';
import type { ITableProps } from 'src/components';
import { Media } from './../../components/Media';
import { CompactTableDesktop } from './CompactTableDesktop/CompactTableDesktop';
import { CompactTableMobile } from './CompactTableMobile/CompactTableMobile';
import type { ITableField } from './LoadingSkeleton/types';
import type { ITablePaginationPageOptions } from './TablePagination/TablePagination';
import { TablePagination } from './TablePagination/TablePagination';
import { fullWidthClass } from './styles.css';

export interface ICompactTableProps {
  label?: string;
  data: any[];
  fields: ITableField[];
  isLoading?: boolean;
  totalCount?: number;
  pageSize?: number;
  setPage?: (page: ITablePaginationPageOptions) => void;
  variant?: ITableProps<HTMLTableElement>['variant'];
  pageInfo?: {
    endCursor?: string;
    startCursor?: string;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export const CompactTable: React.FC<ICompactTableProps> = ({
  fields,
  data,
  label,
  isLoading = false,
  totalCount,
  variant = 'default',
  pageSize,
  setPage,
  pageInfo,
  ...props
}) => {
  return (
    <>
      <Media lessThan="sm" className={fullWidthClass}>
        <CompactTableMobile
          data-isloading={isLoading}
          variant={variant}
          isLoading={isLoading}
          fields={fields}
          data={data}
          {...props}
        />
      </Media>
      <Media greaterThanOrEqual="sm" className={fullWidthClass}>
        <CompactTableDesktop
          data-isloading={isLoading}
          variant={variant}
          isLoading={isLoading}
          fields={fields}
          data={data}
          label={label}
          {...props}
        />
      </Media>
      {!!(setPage && pageInfo && pageSize) && (
        <TablePagination
          pageSize={pageSize}
          setPage={setPage}
          pageInfo={pageInfo}
        />
      )}
    </>
  );
};
