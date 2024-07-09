import { Media } from '@/components/layout/media';
import React from 'react';
import { fullWidthClass } from '../globalstyles.css';
import type { ITableField } from '../loading-skeleton/types';
import CompactTableDesktop from './compact-table-desktop/compact-table-desktop';
import CompactTableMobile from './compact-table-mobile/compact-table-mobile';

export interface ICompactTableProps {
  label?: string;
  data: any[];
  fields: ITableField[];
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
