import { styled } from './../../styles';
import { IGridItem } from './types';

import React, { FC } from 'react';

const BaseItem = styled('div', {
  gridColumnStart: 'auto',
});

const checkSpan = (
  colStart: IGridItem['colStart'],
  colEnd: IGridItem['colEnd'],
  colSpan?: IGridItem['colSpan'],
): string => {
  return `${colStart}/${colEnd}`;
};

const GridItem: FC<IGridItem> = ({
  children,
  colSpan,
  colStart = 'auto',
  colEnd = 'auto',
  rowSpan,
  rowStart = 'auto',
  rowEnd = 'auto',
  area,
  bg,
}) => {
  const styles = {
    gridColumn: checkSpan(colStart, colEnd, colSpan),
    gridRow: checkSpan(rowStart, rowEnd, rowSpan),
    gridArea: area,
    backgroundColor: bg,
  };

  return <BaseItem css={styles}>{children}</BaseItem>;
};

export default GridItem;
