import { IHeightBlock } from '@/services/block';
import { GridItem } from '@kadena/react-ui';
import React from 'react';
import { gridItemClass } from '../block-table.css';
interface IBlockRowProps {
  blockRowData: IHeightBlock;
  heights: number[];
}

const BlockRow: React.FC<IBlockRowProps> = ({ blockRowData, heights }) => {
  return (
    <>
      <GridItem className={gridItemClass}>
        {blockRowData[heights[0]]?}
      </GridItem>
      <GridItem className={gridItemClass}></GridItem>
      <GridItem className={gridItemClass}>{chainId}</GridItem>
      <GridItem className={gridItemClass}>{chainId}</GridItem>
    </>
  );
};

export default BlockRow;
