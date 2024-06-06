import type { Transfer } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import React from 'react';
import CompactTransfersTableDesktop from './compact-transfers-table-desktop/compact-transfers-table-desktop';
import CompactTransfersTableMobile from './compact-transfers-table-mobile/compact-transfers-table-mobile';

interface ICompactTransfersTableProps {
  transfers: Transfer[];
}

const CompactTransfersTable: React.FC<ICompactTransfersTableProps> = ({
  transfers,
}) => {
  return (
    <>
      <Media lessThan="sm">
        <CompactTransfersTableMobile transfers={transfers} />
      </Media>
      <Media greaterThanOrEqual="sm">
        <CompactTransfersTableDesktop transfers={transfers} />
      </Media>
    </>
  );
};
export default CompactTransfersTable;
