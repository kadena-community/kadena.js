import { Media } from '@/components/layout/media';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React from 'react';
import { blockGridStyle } from '../block-table.css';
import { columnTitleClass, headerColumnStyle } from './block-header.css';

interface IBlockTableHeaderProps {
  startColumns: Array<{ title: string; subtitle?: string }>;
  heightColumns: Array<number>;
  endColumn: { title: string; subtitle?: string };
}

const blockHeightColumnDescription = 'Block Height';
const blockHeightColumnSmallDescription = 'B. Height';

const BlockTableHeader: React.FC<IBlockTableHeaderProps> = ({
  startColumns,
  heightColumns,
  endColumn,
}) => {
  return (
    <Grid className={classNames(blockGridStyle)}>
      {startColumns.map((column, index) => (
        <Stack key={index} className={headerColumnStyle}>
          <Text as="p" variant="body" size="small" className={columnTitleClass}>
            {column.title}
          </Text>

          <Media greaterThanOrEqual="md">
            <Text as="p" variant="body" size="small" bold>
              {column.subtitle}
            </Text>
          </Media>
        </Stack>
      ))}

      {heightColumns.map((height, index) => (
        <Stack key={index} className={headerColumnStyle}>
          <Media greaterThanOrEqual="md">
            <Text variant="body" size="small" className={columnTitleClass}>
              {blockHeightColumnDescription}
            </Text>
          </Media>

          <Media lessThan="md">
            <Text variant="body" size="small" className={columnTitleClass}>
              {blockHeightColumnSmallDescription}
            </Text>
          </Media>

          <Text variant="body" size="small" bold>
            {height}
          </Text>
        </Stack>
      ))}

      <Stack className={headerColumnStyle}>
        <Text as="p" variant="body" size="small" className={columnTitleClass}>
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
