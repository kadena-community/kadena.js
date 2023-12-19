import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Box, IBoxProps } from '../Box';
import type { ResponsiveInputType } from './Grid.css';
import { containerColumnVariants, gridContainerClass } from './Grid.css';

export interface IGridProps
  extends Omit<
    IBoxProps,
    'display' | 'flex' | 'alignItems' | 'flexDirection' | 'justifyContent'
  > {
  columns?: ResponsiveInputType;
}

const assembleColumnVariants = (
  columns: ResponsiveInputType,
): string | string[] => {
  if (typeof columns === 'number') {
    return containerColumnVariants.xs[columns];
  }

  return Object.entries(columns).map(([key, value]) => {
    return containerColumnVariants[key as keyof typeof containerColumnVariants][
      value
    ];
  });
};

export const Grid: FC<IGridProps> = ({
  className,
  children,
  columns,
  ...props
}) => {
  const classList = classNames(
    gridContainerClass,
    columns && assembleColumnVariants(columns),
    className,
  );
  return (
    <Box className={classList} {...props}>
      {children}
    </Box>
  );
};
