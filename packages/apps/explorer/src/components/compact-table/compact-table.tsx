import { Media } from '@/components/layout/media';
import type { FC } from 'react';
import React from 'react';
import CompactTableDesktop from './compact-table-desktop/compact-table-desktop';
import CompactTableMobile from './compact-table-mobile/compact-table-mobile';

export interface ICompactTableProps {
  label?: string;
  data: any[];
  fields: ITableField[];
  isLoading?: boolean;
}

export interface ITableField {
  width: any;
  variant?: 'body' | 'code';
  label: string;
  key: string;
  render?: FC<{ value: string }>;
  isLoading?: boolean;
}

const CompactTable: React.FC<ICompactTableProps> = ({
  fields,
  data,
  label,
  isLoading = false,
}) => {
  return (
    <>
      <Media lessThan="sm">
        <CompactTableMobile isLoading={isLoading} fields={fields} data={data} />
      </Media>
      <Media greaterThanOrEqual="sm">
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
