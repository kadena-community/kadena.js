import BlockActivityChart from '@/components/block-activity-graph/block-activity-graph';
import type { IHeightBlock } from '@/services/block';
import { formatNumberWithUnit } from '@/services/format';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React, { useState } from 'react';
import BlockCell from '../block-cell/block-cell';
import {
  blockActivityColumnClass,
  columnTitleClass,
  headerColumnStyle,
} from '../block-header/block-header.css';
import { blockGridHoverableStyle, blockGridStyle } from '../block-table.css';
import { textStyle } from './block-row.css';
import HeightInfo from './height-info/height-info';
interface IBlockTableRowProps {
  blockRowData: IHeightBlock;
  heights: number[];
  chainId: number;
  maxBlockTxCount: number;
}

const BlockTableRow: React.FC<IBlockTableRowProps> = ({
  blockRowData,
  heights,
  chainId,
  maxBlockTxCount,
}) => {
  const [openBlock, setOpenBlock] = useState<any>();
  const blockDifficulty =
    blockRowData[heights[3]]?.difficulty ||
    blockRowData[heights[2]]?.difficulty ||
    blockRowData[heights[1]]?.difficulty ||
    blockRowData[heights[0]]?.difficulty ||
    'N/A';

  const handleOpenHeightBlock = (
    height: number,
    chainId: number,
    hash: string,
  ) => {
    // if block is already open, close again
    if (
      openBlock?.chainId === chainId &&
      openBlock?.height === height &&
      openBlock?.hash === hash
    ) {
      setOpenBlock(undefined);
      return;
    }

    setOpenBlock({
      height,
      chainId,
      hash,
    });
  };

  const isShowHeightInfo = openBlock?.chainId === chainId;

  return (
    <>
      {' '}
      <Grid className={classNames(blockGridStyle, blockGridHoverableStyle)}>
        <Stack className={headerColumnStyle}>
          <Text className={textStyle} bold>
            {chainId}
          </Text>
        </Stack>

        <Stack className={headerColumnStyle}>
          <Text as="span" variant="code" bold>
            {formatNumberWithUnit(Number(blockDifficulty))}
            <Text as="span" className={columnTitleClass}>
              H
            </Text>
          </Text>
        </Stack>

        {heights.map((height) =>
          blockRowData[height] ? (
            <BlockCell
              key={`${height}${chainId}`}
              height={blockRowData[height]}
              chainId={chainId}
              onOpenHeight={handleOpenHeightBlock}
            />
          ) : (
            <Stack
              key={`no-block-${chainId}-${height}`}
              className={headerColumnStyle}
              width="100%"
            >
              <Text>-</Text>
            </Stack>
          ),
        )}

        <Stack
          className={classNames(headerColumnStyle, blockActivityColumnClass)}
        >
          <BlockActivityChart
            maxBlockTxCount={maxBlockTxCount}
            data={heights.map((height) => ({
              height,
              data: blockRowData[height]?.txCount ?? 0,
            }))}
          />
        </Stack>
      </Grid>
      {isShowHeightInfo && <HeightInfo hash={openBlock.hash} />}
    </>
  );
};

export default BlockTableRow;
