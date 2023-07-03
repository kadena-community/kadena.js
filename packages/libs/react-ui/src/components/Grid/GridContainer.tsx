import {
  containerColumnVariants,
  gapVariants,
  gridContainerClass,
  ResponsiveInputType,
} from './Grid.css';

import classNames from 'classnames';
import React, { FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  columns?: ResponsiveInputType;
  spacing?: keyof typeof gapVariants;
}

const GridContainer: FC<IGridContainerProps> = ({
  children,
  columns,
  spacing = 'md',
}) => {
  const classList = classNames(
    gapVariants[spacing],
    gridContainerClass,
    columns && columns.sm && containerColumnVariants.sm[columns.sm],
    columns && columns.md && containerColumnVariants.md[columns.md],
    columns && columns.lg && containerColumnVariants.lg[columns.lg],
    columns && columns.xl && containerColumnVariants.xl[columns.xl],
    columns && columns.xxl && containerColumnVariants.xxl[columns.xxl],
  );
  return <div className={classList}>{children}</div>;
};

export default GridContainer;
