import { IGridItemProps } from '../../typings';

import { styled } from './../../styles';

import React, { FC } from 'react';

const BaseItem = styled('div', {
  gridColumnStart: 'auto',
});

const checkSpan = (
  colStart: IGridItemProps['colStart'],
  colEnd: IGridItemProps['colEnd'],
): string => {
  return `${colStart}/${colEnd}`;
};

const GridItem: FC<IGridItemProps> = ({
  children,
  colStart = 'auto',
  colEnd = 'auto',
  rowStart = 'auto',
  rowEnd = 'auto',
  area,
  bg,
}) => {
  const styles = {
    gridColumn: checkSpan(colStart, colEnd),
    gridRow: checkSpan(rowStart, rowEnd),
    gridArea: area,
    backgroundColor: bg,
  };

  return <BaseItem css={styles}>{children}</BaseItem>;
};

export default GridItem;
