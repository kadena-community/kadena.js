import {
  BlockQueryResult,
  NewBlocksSubscriptionResult,
} from '@/__generated__/sdk';
import { blockHeightColumnDescription } from '@/constants/block-table';
import { Grid, GridItem, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import { Media } from '../layout/media';
import { blockGridStyle, gridItemClass } from './block-table.css';

interface IBlockTableProps {
  headerColumns: Array<{ title: string; subtitle?: string }>;
  blockHeightColumns: Array<number>;
  blockData: NewBlocksSubscriptionResult['data'];
}

const BlockTable: React.FC<IBlockTableProps> = ({
  headerColumns,
  blockHeightColumns,
  blockData,
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

        <GridItem className={gridItemClass}>sd</GridItem>
        <GridItem className={gridItemClass}>sd</GridItem>
        <GridItem className={gridItemClass}>sd</GridItem>
        <GridItem className={gridItemClass}>sd</GridItem>
      </Grid>
    </Stack>
  );
};

export default BlockTable;
