import { Media } from '@/components/layout/media';
import { Grid, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import {
  blockGridStyle,
  blockHeightColumnHeaderStyle,
} from '../block-table.css';
import { headerColumnStyle } from './block-header.css';

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
        <Stack key={0} className={headerColumnStyle}>
          <Text variant="body" size="small">
            {startColumns[0].title}
          </Text>
          <Text variant="body" size="small" bold>
            {startColumns[0].subtitle}
          </Text>
        </Stack>
      ) : (
        startColumns.map((column, index) => (
          <Stack key={index} className={headerColumnStyle}>
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

      {heightColumns.map((height, index) => (
        <Stack key={index} className={headerColumnStyle}>
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

      {!isCompact && (
        <Stack className={headerColumnStyle}>
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
