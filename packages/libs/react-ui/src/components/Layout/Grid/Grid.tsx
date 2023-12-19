import type { Atoms } from '@theme/atoms.css';
import { atoms } from '@theme/atoms.css';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { ResponsiveInputType } from './Grid.css';
import { containerColumnVariants, gridContainerClass } from './Grid.css';

export interface IGridProps
  extends Pick<
    Atoms,
    | 'height'
    | 'margin'
    | 'marginBlockEnd'
    | 'marginInlineStart'
    | 'marginInlineEnd'
    | 'marginBlockStart'
    | 'marginInline'
    | 'marginBlock'
    | 'maxWidth'
    | 'minWidth'
    | 'overflow'
    | 'padding'
    | 'paddingBlockEnd'
    | 'paddingInlineStart'
    | 'paddingInlineEnd'
    | 'paddingBlockStart'
    | 'paddingInline'
    | 'paddingBlock'
    | 'width'
    | 'gap'
  > {
  className?: string;
  children?: ReactNode;
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
  gap = 'md',
  height,
  margin,
  marginBlockEnd,
  marginInlineStart,
  marginInlineEnd,
  marginBlockStart,
  marginInline,
  marginBlock,
  maxWidth,
  minWidth,
  overflow,
  padding,
  paddingBlockEnd,
  paddingInlineStart,
  paddingInlineEnd,
  paddingBlockStart,
  paddingInline,
  paddingBlock,
  width,
}) => {
  const classList = classNames(
    gridContainerClass,
    columns && assembleColumnVariants(columns),
    atoms({
      gap,
      height,
      margin,
      marginBlockEnd,
      marginInlineStart,
      marginInlineEnd,
      marginBlockStart,
      marginInline,
      marginBlock,
      maxWidth,
      minWidth,
      overflow,
      padding,
      paddingBlockEnd,
      paddingInlineStart,
      paddingInlineEnd,
      paddingBlockStart,
      paddingInline,
      paddingBlock,
      width,
    }),
    className,
  );
  return <div className={classList}>{children}</div>;
};
