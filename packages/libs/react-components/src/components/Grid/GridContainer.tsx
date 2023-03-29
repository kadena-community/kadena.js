import { IGridContainerProps } from '../../typings';
import { convertStyles } from '../../utils';

import { styled } from './../../styles';

import React, { FC } from 'react';

const BasicContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridGap: '$1',
});

const GridContainer: FC<IGridContainerProps> = ({
  children,
  gap,
  templateAreas,
  templateRows,
  templateColumns,
}) => {
  const styles = convertStyles({
    gridGap: gap ?? {},
    gridTemplateColumns: templateColumns ?? {},
    gridTemplateRows: templateRows ?? {},
    gridTemplateAreas: templateAreas ?? {},
  });

  return <BasicContainer css={styles}>{children}</BasicContainer>;
};

export default GridContainer;
