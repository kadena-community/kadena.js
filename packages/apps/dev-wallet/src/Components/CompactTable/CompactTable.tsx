import React from 'react';
import { Media } from '../Media/media';
import { CompactTableDesktop } from './CompactTableDesktop/CompactTableDesktop';
import { CompactTableMobile } from './CompactTableMobile/CompactTableMobile';
import type { ITablePaginationPageOptions } from './TablePagination/TablePagination';
import { TablePagination } from './TablePagination/TablePagination';

import type { FC } from 'react';
import { fullWidthClass } from './styles.css';

export type ILoadingVariants = 'default' | 'icon';

export interface ITableField {
  width: any;
  variant?: 'body' | 'code';
  align?: 'start' | 'end' | 'center';
  label: string;
  key: string | string[];
  render?: FC<{ value: string }> | FC<{ value: string }>[];
  isLoading?: boolean;
  loaderVariant?: ILoadingVariants;
}

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

export const CompactTable: React.FC<ICompactTableProps> = ({
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
