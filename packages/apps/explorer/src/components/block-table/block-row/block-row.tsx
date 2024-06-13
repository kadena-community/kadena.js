import BlockActivityChart from '@/components/block-activity-graph/block-activity-graph';
import routes from '@/constants/routes';
import type { IHeightBlock } from '@/services/block';
import { formatNumberWithUnit } from '@/services/format';
import { MonoPlayArrow } from '@kadena/react-icons/system';
import { Button, Grid, Link, Stack, Text } from '@kadena/react-ui';
import React, { useState } from 'react';
import {
  blockGridStyle,
  blockHeightColumnHeaderStyle,
} from '../block-table.css';
import {
  rowChainElementStyle,
  rowChartElementStyle,
  rowLinkElementStyle,
  rowTextElementStyle,
  textStyle,
} from './block-row.css';
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
  const [expandedRow, setExpandedRow] = useState<boolean>(false);

  const blockDifficulty =
    blockRowData[heights[3]]?.difficulty ||
    blockRowData[heights[2]]?.difficulty ||
    blockRowData[heights[1]]?.difficulty ||
    blockRowData[heights[0]]?.difficulty ||
    'N/A';

  return (
    <>
      <Grid columns={4} className={blockGridStyle}>
        <Stack className={rowChainElementStyle}>
          <Button
            startVisual={
              <MonoPlayArrow
                style={expandedRow ? { transform: 'rotate(90deg)' } : undefined}
              />
            }
            variant="transparent"
            onClick={() => setExpandedRow(!expandedRow)}
          />

          <Text className={textStyle}>{chainId}</Text>
        </Stack>

        {!isCompact && (
          <Stack className={rowTextElementStyle}>
            <Text variant="code">
              {`${formatNumberWithUnit(Number(blockDifficulty))}H`}
            </Text>
          </Stack>
        )}

        <Stack>
          {heights.map((height) =>
            blockRowData[height] ? (
              <Link
                key={`block-${chainId}-${height}`}
                className={rowLinkElementStyle}
                href={`${routes.BLOCK_DETAILS}/${blockRowData[height].hash}`}
              >
                <Text className={blockHeightColumnHeaderStyle} variant="code">
                  {blockRowData[height].txCount}
                </Text>
              </Link>
            ) : (
              <Stack
                key={`no-block-${chainId}-${height}`}
                className={rowTextElementStyle}
                width="100%"
              >
                <Text>-</Text>
              </Stack>
            ),
          )}
        </Stack>

        {!isCompact && (
          <Stack className={rowChartElementStyle}>
            <BlockActivityChart
              data={heights.map((height) => blockRowData[height]?.txCount || 0)}
            />
          </Stack>
        )}
      </Grid>
    </>
  );
};

export default BlockTableRow;
