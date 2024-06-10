import { Media } from '@/components/layout/media';
import { Grid, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import {
  blockGridStyle,
  blockHeightColumnHeaderStyle,
} from '../block-table.css';

interface IBlockTableHeaderProps {
  startColumns: Array<{ title: string; subtitle?: string }>;
  heightColumns: Array<number>;
  endColumn: { title: string; subtitle?: string };
  isCompact?: boolean;
}

const blockHeightColumnDescription = 'Block Height';

const BlockTableHeader: React.FC<IBlockTableHeaderProps> = ({
  startColumns,
  heightColumns,
  endColumn,
  isCompact,
}) => {
  return (
    <Grid columns={4} className={blockGridStyle}>
      {isCompact ? (
        <Stack
          key={0}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          borderStyle="solid"
          borderWidth="hairline"
          padding={'md'}
        >
          <Text variant="body" size="small">
            {startColumns[0].title}
          </Text>
          <Text variant="body" size="small" bold>
            {startColumns[0].subtitle}
          </Text>
        </Stack>
      ) : (
        startColumns.map((column, index) => (
          <Stack
            key={index}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            borderStyle="solid"
            borderWidth="hairline"
            padding={'md'}
          >
            <Text variant="body" size="small">
              {column.title}
            </Text>
            {isCompact ?? (
              <Text variant="body" size="small" bold>
                {column.subtitle}
              </Text>
            )}
          </Stack>
        ))
      )}
      <Stack borderStyle="solid" borderWidth="hairline">
        {heightColumns.map((height, index) => (
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
      {!isCompact && (
        <Stack
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          borderStyle="solid"
          borderWidth="hairline"
          padding={'sm'}
        >
          <Text variant="body" size="small">
            {endColumn.title}
          </Text>
          <Text variant="body" size="small" bold>
            {endColumn.subtitle}
          </Text>
        </Stack>
      )}
    </Grid>
  );
};

export default BlockTableHeader;
