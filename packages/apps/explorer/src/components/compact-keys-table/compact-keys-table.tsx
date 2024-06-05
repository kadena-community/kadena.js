import { Media } from '@/components/layout/media';
import type { FC } from 'react';
import React from 'react';
import CompactKeysTableDesktop from './compact-keys-table-desktop/compact-keys-table-desktop';
import CompactKeysTableMobile from './compact-keys-table-mobile/compact-keys-table-mobile';
import type { ICompactKeyTableProps } from './types';

const CompactKeysTable: FC<ICompactKeyTableProps> = ({ keys }) => {
  return (
    <>
      <Media lessThan="sm">
        <CompactKeysTableMobile keys={keys} />
      </Media>
      <Media greaterThanOrEqual="sm">
        <CompactKeysTableDesktop keys={keys} />
      </Media>
    </>
  );
};
export default CompactKeysTable;
