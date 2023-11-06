import classnames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { ResponsiveInputType } from './Grid.css';
import { gridItemClass, itemColumnVariants, rowSpanVariants } from './Grid.css';

export interface IGridItemProps {
  className?: string;
  children?: ReactNode;
  columnSpan?: ResponsiveInputType;
  rowSpan?: keyof typeof rowSpanVariants;
}

const assembleColumnSpanVariants = (
  columnSpan: ResponsiveInputType,
): string | string[] => {
  if (typeof columnSpan === 'number') {
    return itemColumnVariants.xs[columnSpan];
  }

  return Object.entries(columnSpan).map(([key, value]) => {
    return itemColumnVariants[key as keyof typeof itemColumnVariants][value];
  });
};

export const GridItem: FC<IGridItemProps> = ({
  className,
  children,
  columnSpan,
  rowSpan = 1,
}) => {
  return (
    <div
      className={classnames(
        gridItemClass,
        rowSpanVariants[rowSpan],
        columnSpan && assembleColumnSpanVariants(columnSpan),
        className,
      )}
    >
      {children}
    </div>
  );
};
