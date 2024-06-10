import { Media } from '@/components/layout/media';
import { blockHeightColumnDescription } from '@/constants/block-table';
import { Grid, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import {
  blockGridStyle,
  blockHeightColumnHeaderStyle,
} from '../block-table.css';

interface IBlockTableHeaderProps {
  headerColumns: Array<{ title: string; subtitle?: string }>;
  blockHeightColumns: Array<number>;
  headerLastColumn?: { title: string; subtitle?: string };
}

const BlockTableHeader: React.FC<IBlockTableHeaderProps> = ({
  headerColumns,
  blockHeightColumns,
  headerLastColumn,
}) => {
  return (
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
  );
};

export default BlockTableHeader;
