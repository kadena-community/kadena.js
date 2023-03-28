import { IThemeColors, IThemeSizes } from './../..';

import { ReactNode } from 'react';

export interface IGridContainer {
  children?: ReactNode;
  gap?: IThemeSizes;
  templateAreas?: string;
  templateRows?: string;
  templateColumns?: string;
}

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
