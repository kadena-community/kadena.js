import { IThemeColors, styled } from './../../styles';

import type * as Stitches from '@stitches/react';
import React, { FC, ReactNode } from 'react';

const BaseItem = styled('div', {
  gridColumnStart: 'auto',
});

export type IColSpan = number | 'auto';

export interface IGridItemProps {
  children?: ReactNode;
  colStart?: IColSpan;
  colEnd?: IColSpan;
  rowStart?: IColSpan;
  rowEnd?: IColSpan;
  area?: Stitches.CSSProperties['gridArea'];
  bg?: IThemeColors;
}

const createSpan = (
  colStart: IGridItemProps['colStart'],
  colEnd: IGridItemProps['colEnd'],
): string => {
  if (!colStart || !colEnd) return 'auto';
  return `${colStart}/${colEnd}`;
};

const GridItem: FC<IGridItemProps> = ({
  children,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  area,
  bg,
}) => {
  const styles = {
    gridColumn: createSpan(colStart, colEnd),
    gridRow: createSpan(rowStart, rowEnd),
    gridArea: area,
    backgroundColor: bg,
  };

  return <BaseItem css={styles}>{children}</BaseItem>;
};

export default GridItem;
