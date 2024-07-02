import { Media } from '@/components/layout/media';
import { Grid, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import { blockGridStyle } from '../block-table.css';
import { headerColumnStyle } from './block-header.css';

interface IBlockTableHeaderProps {
  startColumns: Array<{ title: string; subtitle?: string }>;
  heightColumns: Array<number>;
  endColumn: { title: string; subtitle?: string };
}

const blockHeightColumnDescription = 'Block Height';

const BlockTableHeader: React.FC<IBlockTableHeaderProps> = ({
  startColumns,
  heightColumns,
  endColumn,
}) => {
  return (
    <Grid className={blockGridStyle}>
      {startColumns.map((column, index) => (
        <Stack key={index} className={headerColumnStyle}>
          <Text as="p" variant="body" size="small">
            {column.title}
          </Text>

          <Text as="p" variant="body" size="small" bold>
            {column.subtitle}
          </Text>
        </Stack>
      ))}

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

      <Stack className={headerColumnStyle}>
        <Text as="p" variant="body" size="small">
          {endColumn.title}
        </Text>
        <Text as="p" variant="body" size="small" bold>
          {endColumn.subtitle}
        </Text>
      </Stack>
    </Grid>
  );
};

export default BlockTableHeader;
