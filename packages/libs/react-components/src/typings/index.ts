import { breakpoints, sizes } from '../styles/stitches.config';
import { IThemeColors } from '..';

import { ReactNode } from 'react';

export type Primitive = number | string | boolean;
export type IThemeSizes = `$${keyof typeof sizes}`;

export type IThemeBreakpointProps = keyof typeof breakpoints;
export type IStyleBreakpointProps = `@${keyof typeof breakpoints}`;

export type ICSSPropType = Primitive | Record<IThemeBreakpointProps, Primitive>;

export interface IGridContainerProps {
  children?: ReactNode;
  gap?: ICSSPropType;
  templateAreas?: ICSSPropType;
  templateRows?: ICSSPropType;
  templateColumns?: ICSSPropType;
}

export type IColSpan = number | 'auto';

export interface IGridItem {
  children?: ReactNode;
  colStart?: IColSpan;
  colEnd?: IColSpan;
  rowStart?: IColSpan;
  rowEnd?: IColSpan;
  area?: string;
  bg?: IThemeColors;
}
