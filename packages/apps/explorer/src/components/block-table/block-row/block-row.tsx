import BlockActivityChart from '@/components/block-activity-graph/block-activity-graph';
import ValueLoader from '@/components/loading-skeleton/value-loader/value-loader';
import type { IHeightBlock } from '@/services/block';
import { formatNumberWithUnit } from '@/services/format';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React from 'react';
import BlockCell from '../block-cell/block-cell';
import {
  blockActivityColumnClass,
  columnTitleClass,
  headerColumnStyle,
} from '../block-header/block-header.css';
import { useBlockInfo } from '../block-info-context/block-info-context';
import {
  blockGridHoverableStyle,
  blockGridStyle,
  blockWrapperClass,
  blockWrapperSelectedClass,
} from '../block-table.css';
import { textStyle } from './block-row.css';
import HeightInfo from './height-info/height-info';
interface IBlockTableRowProps {
  blockRowData: IHeightBlock;
  heights: number[];
  chainId: number;
  maxBlockTxCount: number;
  isLoading?: boolean;
}

const BlockTableRow: React.FC<IBlockTableRowProps> = ({
  blockRowData,
  heights,
  chainId,
  maxBlockTxCount,
  isLoading,
}) => {
  const { selectedChainId, selectedHeight } = useBlockInfo();
  const blockDifficulty =
    blockRowData[heights[3]]?.difficulty ||
    blockRowData[heights[2]]?.difficulty ||
    blockRowData[heights[1]]?.difficulty ||
    blockRowData[heights[0]]?.difficulty ||
    'N/A';

  const isShowHeightInfo = selectedChainId === chainId;

  return (
    <Stack
      className={classNames(blockWrapperClass, {
        [blockWrapperSelectedClass]: isShowHeightInfo,
      })}
      width="100%"
      flexDirection="column"
    >
      <Grid className={classNames(blockGridStyle, blockGridHoverableStyle)}>
        <Stack className={headerColumnStyle}>
          <Text className={textStyle} bold>
            {chainId}
          </Text>
        </Stack>

        <Stack className={headerColumnStyle}>
          <ValueLoader isLoading={isLoading}>
            <Text as="span" variant="code" bold>
              {formatNumberWithUnit(Number(blockDifficulty))}
              <Text as="span" className={columnTitleClass}>
                H
              </Text>
            </Text>
          </ValueLoader>
        </Stack>

        {heights.map((height) =>
          blockRowData[height] ? (
            <BlockCell
              isLoading={isLoading}
              isSelected={isShowHeightInfo && height === selectedHeight?.height}
              key={`${height}${chainId}`}
              height={blockRowData[height]}
              chainId={chainId}
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
      {isShowHeightInfo && <HeightInfo height={selectedHeight} />}
    </Stack>
  );
};

export default BlockTableRow;
