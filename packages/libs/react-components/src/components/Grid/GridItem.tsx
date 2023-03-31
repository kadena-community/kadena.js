import { config } from '../../styles';

import { styled } from './../../styles';

import type { CSSProperties, PropertyValue } from '@stitches/react';
import React, { FC, ReactNode } from 'react';

const BaseItem = styled('div', {
  gridColumnStart: 'auto',
});

export type ColSpanType = number | 'auto';

export interface IGridItemProps {
  children?: ReactNode;
  colStart?: ColSpanType;
  colEnd?: ColSpanType;
  rowStart?: ColSpanType;
  rowEnd?: ColSpanType;
  area?: CSSProperties['gridArea'];
  bg: PropertyValue<'backgroundColor', typeof config>;
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
