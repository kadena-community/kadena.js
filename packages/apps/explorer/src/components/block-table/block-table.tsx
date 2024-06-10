import { IChainBlock } from '@/services/block';
import { Stack } from '@kadena/react-ui';
import React from 'react';
import { Media } from '../layout/media';
import BlockTableHeader from './block-header/block-header';
import BlockRow from './block-row/block-row';

interface IBlockTableProps {
  headerColumns: Array<{ title: string; subtitle?: string }>;
  blockHeightColumns: Array<number>;
  blockData: IChainBlock;
  headerLastColumn?: { title: string; subtitle?: string };
}

const BlockTable: React.FC<IBlockTableProps> = ({
  headerColumns,
  blockHeightColumns,
  blockData,
  headerLastColumn,
}) => {
  return (
    <Stack display="flex" flexDirection={'column'} gap={'sm'} padding={'md'}>
      <BlockTableHeader
        headerColumns={headerColumns}
        blockHeightColumns={blockHeightColumns}
        headerLastColumn={headerLastColumn}
      />
      {Object.keys(blockData).map((chainId) => (
        <>
          <Media lessThan="sm">
            <BlockRow
              blockRowData={blockData[Number(chainId)]}
              heights={blockHeightColumns}
              chainId={Number(chainId)}
              compact
            />
          </Media>
          <Media greaterThanOrEqual="sm">
            <BlockRow
              blockRowData={blockData[Number(chainId)]}
              heights={blockHeightColumns}
              chainId={Number(chainId)}
            />
          </Media>
        </>
      ))}
    </Stack>
  );
};

export default BlockTable;
