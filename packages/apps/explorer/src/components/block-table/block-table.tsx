import type { IChainBlock } from '@/services/block';
import { Stack } from '@kadena/react-ui';
import React from 'react';
import BlockTableHeader from './block-header/block-header';
import BlockRow from './block-row/block-row';

interface IBlockTableProps {
  heightColumns: Array<number>;
  blockData: IChainBlock;
  isCompact?: boolean;
}

export const startColumns = [
  { title: 'Chain', subtitle: 'Number' },
  { title: 'Chain', subtitle: 'Difficulty' },
];

const endColumn = { title: 'Block', subtitle: 'Activity' };

const BlockTable: React.FC<IBlockTableProps> = ({
  heightColumns,
  blockData,
  isCompact,
}) => {
  return (
    <Stack display="flex" flexDirection={'column'} gap={'md'} padding={'md'}>
      <BlockTableHeader
        startColumns={startColumns}
        heightColumns={heightColumns}
        endColumn={endColumn}
        isCompact={isCompact}
      />
      {Object.keys(blockData).map((chainId) => (
        <BlockRow
          key={chainId}
          blockRowData={blockData[Number(chainId)]}
          heights={heightColumns}
          chainId={Number(chainId)}
          isCompact={isCompact}
        />
      ))}
    </Stack>
  );
};

export default BlockTable;
