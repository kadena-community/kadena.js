import { colSpanVariants, gridItemClass, rowSpanVariants } from './Grid.css';

import classNames from 'classnames';
import React, { CSSProperties, FC, ReactNode } from 'react';

export type ColSpanType = number | 'auto';

export interface IGridItemProps {
  children?: ReactNode;

  columnSpan?: keyof typeof colSpanVariants;
  rowSpan?: keyof typeof rowSpanVariants;
}

const GridItem: FC<IGridItemProps> = ({
  children,

  columnSpan = 1,
  rowSpan = 1,
}) => {
  const className = classNames(
    gridItemClass,
    colSpanVariants[columnSpan],
    rowSpanVariants[rowSpan],
  );
  return <div className={className}>{children}</div>;
};

export default GridItem;
