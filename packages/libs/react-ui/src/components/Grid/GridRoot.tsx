import type { ResponsiveInputType } from './Grid.css';
import {
  containerColumnVariants,
  explicitColumnVariant,
  gapVariants,
  gridContainerClass,
} from './Grid.css';

import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface IGridRootProps
  extends Pick<
    Sprinkles,
    | 'margin'
    | 'marginX'
    | 'marginY'
    | 'marginTop'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginRight'
    | 'padding'
    | 'paddingX'
    | 'paddingY'
    | 'paddingTop'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
  > {
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

export const GridRoot: FC<IGridRootProps> = ({
  children,
  columns,
  margin = undefined,
  marginX = undefined,
  marginY = undefined,
  marginTop = undefined,
  marginBottom = undefined,
  marginLeft = undefined,
  marginRight = undefined,
  gap = '$md',
  padding = undefined,
  paddingX = undefined,
  paddingY = undefined,
  paddingTop = undefined,
  paddingBottom = undefined,
  paddingLeft = undefined,
  paddingRight = undefined,
}) => {
  const classList = classNames(
    gapVariants[gap],
    gridContainerClass,
    columns && assembleColumnVariants(columns),
    sprinkles({
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    }),
  );
  return (
    <div className={classList} data-testid="kda-grid-root">
      {children}
    </div>
  );
};
