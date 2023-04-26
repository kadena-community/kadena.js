import { GridItem as BaseGridItem } from './styles';

import type { CSSProperties } from '@stitches/react';
import React, { FC, ReactNode } from 'react';

export type ColSpanType = number | 'auto';

export interface IGridItemProps {
  children?: ReactNode;
  colStart?: ColSpanType;
  colEnd?: ColSpanType;
  rowStart?: ColSpanType;
  rowEnd?: ColSpanType;
  area?: CSSProperties['gridArea'];
}

const createSpan = (
  colStart: IGridItemProps['colStart'],
  colEnd: IGridItemProps['colEnd'],
): string => {
  if (colStart === undefined || colEnd === undefined) return 'auto';
  return `${colStart}/${colEnd}`;
};

const GridItem: FC<IGridItemProps> = ({
  children,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  area,
}) => {
  const styles = {
    gridColumn: createSpan(colStart, colEnd),
    gridRow: createSpan(rowStart, rowEnd),
    gridArea: area,
  };

  return <BaseGridItem css={styles}>{children}</BaseGridItem>;
};

export default GridItem;
