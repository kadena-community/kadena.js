import { blockHeightColumnDescription } from '@/constants/block-table';
import { IChainBlock } from '@/services/block';
import { Grid, GridItem, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import { Media } from '../layout/media';
import BlockRow from './block-row/block-row';
import {
  blockGridStyle,
  blockHeightColumnHeaderStyle,
} from './block-table.css';

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
      <Grid columns={4} className={blockGridStyle}>
        {headerColumns.map((column, index) => (
          <Stack
            key={index}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            borderStyle="solid"
            borderWidth="hairline"
            padding={'sm'}
          >
            <Text variant="body" size="small">
              {column.title}
            </Text>
            <Media greaterThanOrEqual="sm">
              <Text variant="body" size="small" bold>
                {column.subtitle}
              </Text>
            </Media>
          </Stack>
        ))}
        <Stack borderStyle="solid" borderWidth="hairline">
          {blockHeightColumns.map((height, index) => (
            <Stack
              key={index}
              flexDirection={'column'}
              alignItems={'center'}
              padding={'sm'}
              justifyContent={'center'}
              className={blockHeightColumnHeaderStyle}
            >
              <Media greaterThanOrEqual="sm">
                <Text variant="body" size="small">
                  {blockHeightColumnDescription}
                </Text>
              </Media>

              <Text variant="body" size="small" bold>
                {height}
              </Text>
            </Stack>
          ))}
        </Stack>
        {headerLastColumn && (
          <Stack
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            borderStyle="solid"
            borderWidth="hairline"
            padding={'sm'}
          >
            <Text variant="body" size="small">
              {headerLastColumn?.title}
            </Text>
            <Text variant="body" size="small" bold>
              {headerLastColumn?.subtitle}
            </Text>
          </Stack>
        )}
      </Grid>
      {Object.keys(blockData).map((chainId) => (
        <BlockRow
          blockRowData={blockData[Number(chainId)]}
          heights={blockHeightColumns}
          chainId={Number(chainId)}
        />
      ))}
    </Stack>
  );
};

export default BlockTable;
