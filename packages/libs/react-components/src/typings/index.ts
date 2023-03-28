import { breakpoints, sizes } from '../styles/stitches.config';
import { IThemeColors } from '..';

import { PropertyValue } from '@stitches/react';
import { ReactNode } from 'react';

export type IThemeSizes = `$${keyof typeof sizes}`;

export type IThemeBreakpointProps = keyof typeof breakpoints;
export type IStyleBreakpointProps = `@${keyof typeof breakpoints}`;

export type ICSSPropType<T> = T | Partial<Record<IThemeBreakpointProps, T>>;

export interface IGridContainerProps {
  children?: ReactNode;
  gap?: ICSSPropType<PropertyValue<'gridGap'>>;
  templateAreas?: ICSSPropType<PropertyValue<'gridTemplateAreas'>>;
  templateRows?: ICSSPropType<PropertyValue<'gridTemplateRows'>>;
  templateColumns?: ICSSPropType<PropertyValue<'gridTemplateColumns'>>;
}

export interface IGridContainerStyles {
  gridGap?: IGridContainerProps['gap'];
  gridTemplateAreas?: IGridContainerProps['templateAreas'];
  gridTemplateRows?: IGridContainerProps['templateRows'];
  gridTemplateColumns?: IGridContainerProps['templateColumns'];
}

export type IGridContainerStylesReturned = Partial<
  Record<IStyleBreakpointProps, string>
> & {
  gridGap?: PropertyValue<'gridGap'>;
  gridTemplateAreas?: PropertyValue<'gridTemplateAreas'>;
  gridTemplateRows?: PropertyValue<'gridTemplateRows'>;
  gridTemplateColumns?: PropertyValue<'gridTemplateColumns'>;
};

export type IColSpan = number | 'auto';

export interface IGridItem {
  children?: ReactNode;
  colSpan?: IColSpan;
  colStart?: IColSpan;
  colEnd?: IColSpan;
  rowSpan?: IColSpan;
  rowStart?: IColSpan;
  rowEnd?: IColSpan;
  area?: string;
  bg?: IThemeColors;
}
