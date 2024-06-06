import { Media } from '@/components/layout/media';
import type { FC } from 'react';
import React from 'react';
import CompactTableDesktop from './compact-table-desktop/compact-table-desktop';
import CompactTableMobile from './compact-table-mobile/compact-table-mobile';

export interface ICompactTableProps {
  label?: string;
  data: any[];
  fields: ITableField[];
}

interface ITableField {
  width: any;
  variant?: 'body' | 'code';
  label: string;
  key: string;
  value: FC<{ str: string }>;
}

const CompactTable: React.FC<ICompactTableProps> = ({
  fields,
  data,
  label,
}) => {
  return (
    <>
      <Media lessThan="sm">
        <CompactTableMobile fields={fields} data={data} />
      </Media>
      <Media greaterThanOrEqual="sm">
        <CompactTableDesktop fields={fields} data={data} label={label} />
      </Media>
    </>
  );
};
export default CompactTable;
