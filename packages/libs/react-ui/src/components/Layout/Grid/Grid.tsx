import classNames from 'classnames';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { IBoxProps } from '../Box';
import { Box } from '../Box';
import type { ResponsiveInputType } from './Grid.css';
import { containerColumnVariants, gridContainerClass } from './Grid.css';

export interface IGridProps
  extends Omit<IBoxProps, 'display' | 'flex' | 'flexDirection'> {
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

const BaseGrid = (
  { className, children, columns, ...props }: IGridProps,
  ref: ForwardedRef<HTMLElement>,
): React.ReactElement => {
  const classList = classNames(
    gridContainerClass,
    columns && assembleColumnVariants(columns),
    className,
  );
  return (
    <Box ref={ref} className={classList} {...props}>
      {children}
    </Box>
  );
};

export const Grid = forwardRef(BaseGrid);
