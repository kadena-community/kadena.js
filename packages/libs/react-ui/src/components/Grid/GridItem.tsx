import {
  explicitItemColumnVariant,
  gridItemClass,
  itemColumnVariants,
  ResponsiveInputType,
  rowSpanVariants,
} from './Grid.css';

import classNames from 'classnames';
import React, { FC, ReactNode } from 'react';

export interface IGridItemProps {
  children?: ReactNode;
  columnSpan?: ResponsiveInputType;
  rowSpan?: keyof typeof rowSpanVariants;
}

const GridItem: FC<IGridItemProps> = ({
  children,
  columnSpan,
  rowSpan = 1,
}) => {
  const className = classNames(
    gridItemClass,
    rowSpanVariants[rowSpan],
    columnSpan &&
      typeof columnSpan === 'number' &&
      explicitItemColumnVariant[columnSpan],
    columnSpan &&
      typeof columnSpan !== 'number' &&
      columnSpan.sm &&
      itemColumnVariants.sm[columnSpan.sm],
    columnSpan &&
      typeof columnSpan !== 'number' &&
      columnSpan.md &&
      itemColumnVariants.md[columnSpan.md],
    columnSpan &&
      typeof columnSpan !== 'number' &&
      columnSpan.lg &&
      itemColumnVariants.lg[columnSpan.lg],
    columnSpan &&
      typeof columnSpan !== 'number' &&
      columnSpan.xl &&
      itemColumnVariants.xl[columnSpan.xl],
    columnSpan &&
      typeof columnSpan !== 'number' &&
      columnSpan.xxl &&
      itemColumnVariants.xxl[columnSpan.xxl],
  );
  return (
    <div className={className} data-testid="kda-grid-item">
      {children}
    </div>
  );
};

export default GridItem;
