import {
  explicitItemColumnVariant,
  gridItemClass,
  itemColumnVariants,
  ResponsiveInputType,
  rowSpanVariants,
} from './Grid.css';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface IGridItemProps {
  children?: ReactNode;
  columnSpan?: ResponsiveInputType;
  rowSpan?: keyof typeof rowSpanVariants;
}

const assembleColumnSpanVariants = (
  columnSpan: ResponsiveInputType,
): string | string[] => {
  if (typeof columnSpan === 'number') {
    return explicitItemColumnVariant[columnSpan];
  }

  const { sm, md, lg, xl, xxl } = columnSpan;

  return [
    itemColumnVariants.sm[sm],
    itemColumnVariants.md[md],
    itemColumnVariants.lg[lg],
    itemColumnVariants.xl[xl],
    itemColumnVariants.xxl[xxl],
  ];
};

const GridItem: FC<IGridItemProps> = ({
  children,
  columnSpan,
  rowSpan = 1,
}) => {
  const className = classNames(
    gridItemClass,
    rowSpanVariants[rowSpan],
    columnSpan && assembleColumnSpanVariants(columnSpan),
  );
  return (
    <div className={className} data-testid="kda-grid-item">
      {children}
    </div>
  );
};

export default GridItem;
