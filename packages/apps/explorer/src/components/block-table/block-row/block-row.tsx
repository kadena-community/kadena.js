import BlockActivityChart from '@/components/block-activity-graph/block-activity-graph';
import routes from '@/constants/routes';
import type { IHeightBlock } from '@/services/block';
import { formatNumberWithUnit } from '@/services/format';
import { Grid, Link, Stack, Text } from '@kadena/react-ui';
import classNames from 'classnames';
import React from 'react';
import { headerColumnStyle } from '../block-header/block-header.css';
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
  isCompact?: boolean;
}

const BlockTableRow: React.FC<IBlockTableRowProps> = ({
  blockRowData,
  heights,
  chainId,
  isCompact,
}) => {
  const blockDifficulty =
    blockRowData[heights[3]]?.difficulty ||
    blockRowData[heights[2]]?.difficulty ||
    blockRowData[heights[1]]?.difficulty ||
    blockRowData[heights[0]]?.difficulty ||
    'N/A';

  console.log(heights);
  return (
    <Grid className={classNames(blockGridStyle, blockGridHoverableStyle)}>
      <Stack className={headerColumnStyle}>
        <Text className={textStyle}>{chainId}</Text>
      </Stack>

      {!isCompact && (
        <Stack className={headerColumnStyle}>
          <Text variant="code">
            {`${formatNumberWithUnit(Number(blockDifficulty))}H`}
          </Text>
        </Stack>
      )}

      {heights.map((height) =>
        blockRowData[height] ? (
          <Link
            key={`block-${chainId}-${height}`}
            className={headerColumnStyle}
            href={`${routes.BLOCK_DETAILS}/${blockRowData[height].hash}`}
          >
            <Text className={blockHeightColumnHeaderStyle} variant="code">
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

      {!isCompact && (
        <Stack className={headerColumnStyle}>
          <BlockActivityChart
            data={heights.map((height) => ({
              height,
              data: blockRowData[height]?.txCount ?? 0,
            }))}
          />
        </Stack>
      )}
    </Grid>
  );
};

export default BlockTableRow;
