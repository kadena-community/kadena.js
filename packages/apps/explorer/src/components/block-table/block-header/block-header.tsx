import { Media } from '@/components/layout/media';
import ValueLoader from '@/components/loading-skeleton/value-loader/value-loader';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React from 'react';
import { blockGridStyle, blockWrapperClass } from '../block-table.css';
import { columnTitleClass, headerColumnStyle } from './block-header.css';

interface IBlockTableHeaderProps {
  startColumns: Array<{ title: string; subtitle?: string }>;
  heightColumns: Array<number>;
  endColumn: { title: string; subtitle?: string };
  isLoading: boolean;
}

const blockHeightColumnDescription = 'Height';
const blockHeightColumnSmallDescription = 'Height';

const BlockTableHeader: React.FC<IBlockTableHeaderProps> = ({
  startColumns,
  heightColumns,
  endColumn,
  isLoading,
}) => {
  return (
    <Grid className={classNames(blockGridStyle, blockWrapperClass)}>
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

          <ValueLoader isLoading={isLoading}>
            <Text variant="body" size="small" bold>
              {height}
            </Text>
          </ValueLoader>
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
