import {
  containerColumnVariants,
  explicitColumnVariant,
  gapVariants,
  gridContainerClass,
  ResponsiveInputType,
} from './Grid.css';

import classNames from 'classnames';
import React, { FC, ReactNode } from 'react';

export interface IGridRootProps {
  children?: ReactNode;
  columns?: ResponsiveInputType;
  spacing?: keyof typeof gapVariants;
}

const GridRoot: FC<IGridRootProps> = ({
  children,
  columns,
  spacing = 'md',
}) => {
  const classList = classNames(
    gapVariants[spacing],
    gridContainerClass,
    columns && typeof columns === 'number' && explicitColumnVariant[columns],

    columns &&
      typeof columns !== 'number' &&
      columns.sm &&
      containerColumnVariants.sm[columns.sm],
    columns &&
      typeof columns !== 'number' &&
      columns.md &&
      containerColumnVariants.md[columns.md],
    columns &&
      typeof columns !== 'number' &&
      columns.lg &&
      containerColumnVariants.lg[columns.lg],
    columns &&
      typeof columns !== 'number' &&
      columns.xl &&
      containerColumnVariants.xl[columns.xl],
    columns &&
      typeof columns !== 'number' &&
      columns.xxl &&
      containerColumnVariants.xxl[columns.xxl],
  );
  return (
    <div className={classList} data-testid="kda-grid-root">
      {children}
    </div>
  );
};

export default GridRoot;
