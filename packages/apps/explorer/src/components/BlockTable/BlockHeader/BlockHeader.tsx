import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { Grid, Media, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React from 'react';
import {
  blockGridStyle,
  blockHeaderClass,
  blockWrapperClass,
} from '../blockTable.css';
import { columnTitleClass, headerColumnStyle } from './blockHeader.css';

interface IBlockTableHeaderProps {
  startColumns: Array<{ title: string; subtitle?: string }>;
  heightColumns: Array<number>;
  endColumn: { title: string; subtitle?: string };
  isLoading: boolean;
}

const blockHeightColumnDescription = 'Height';
const blockHeightColumnSmallDescription = 'Height';

export const BlockTableHeader: React.FC<IBlockTableHeaderProps> = ({
  startColumns,
  heightColumns,
  endColumn,
  isLoading,
}) => {
  return (
    <Grid
      className={classNames(
        blockGridStyle,
        blockWrapperClass,
        blockHeaderClass,
      )}
    >
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
