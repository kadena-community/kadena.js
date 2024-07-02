import BlockActivityChart from '@/components/block-activity-graph/block-activity-graph';
import routes from '@/constants/routes';
import type { IHeightBlock } from '@/services/block';
import { formatNumberWithUnit } from '@/services/format';
import { Grid, Link, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React from 'react';
import {
  blockActivityColumnClass,
  columnTitleClass,
  headerColumnStyle,
} from '../block-header/block-header.css';
import {
  blockGridHoverableStyle,
  blockGridStyle,
  blockHeightColumnHeaderStyle,
} from '../block-table.css';
import { textStyle } from './block-row.css';
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
  const blockDifficulty =
    blockRowData[heights[3]]?.difficulty ||
    blockRowData[heights[2]]?.difficulty ||
    blockRowData[heights[1]]?.difficulty ||
    blockRowData[heights[0]]?.difficulty ||
    'N/A';

  return (
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
          <Link
            key={`block-${chainId}-${height}`}
            className={headerColumnStyle}
            href={`${routes.BLOCK_DETAILS}/${blockRowData[height].hash}`}
          >
            <Text className={blockHeightColumnHeaderStyle} variant="code" bold>
              {blockRowData[height].txCount}
            </Text>
          </Link>
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
  );
};

export default BlockTableRow;
