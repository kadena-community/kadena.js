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
  gap?: keyof typeof gapVariants;
}

const assembleColumnVariants = (
  columns: ResponsiveInputType,
): string | string[] => {
  if (typeof columns === 'number') {
    return explicitColumnVariant[columns];
  }

  const { sm, md, lg, xl, xxl } = columns;

  return [
    containerColumnVariants.sm[sm],
    containerColumnVariants.md[md],
    containerColumnVariants.lg[lg],
    containerColumnVariants.xl[xl],
    containerColumnVariants.xxl[xxl],
  ];
};

const GridRoot: FC<IGridRootProps> = ({
  children,
  columns,
  gap = '$md',
}) => {
  const classList = classNames(
    gapVariants[gap],
    gridContainerClass,
    columns && assembleColumnVariants(columns),
  );
  return (
    <div className={classList} data-testid="kda-grid-root">
      {children}
    </div>
  );
};

export default GridRoot;
