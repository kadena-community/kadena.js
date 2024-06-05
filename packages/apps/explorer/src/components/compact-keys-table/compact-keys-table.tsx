import { Media } from '@/components/layout/media';
import type { FC } from 'react';
import React from 'react';
import CompactKeysTableDesktop from './compact-keys-table-desktop/compact-keys-table-desktop';
import CompactKeysTableMobile from './compact-keys-table-mobile/compact-keys-table-mobile';

export interface IKeyProps {
  chainId: string;
  key: string;
  predicate: string;
}

export interface ICompactKeyTableProps {
  keys: IKeyProps[];
}

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
