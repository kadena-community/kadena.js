import { styled } from './../../styles';
import { IGridContainer } from './types';

import React, { FC } from 'react';

const BasicContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridGap: '$2',
});

const GridContainer: FC<IGridContainer> = ({
  children,
  gap,
  templateAreas,
  templateRows,
  templateColumns,
}) => {
  const styles = {
    gridGap: gap,
    gridTemplateAreas: templateAreas,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns,
  };
  return <BasicContainer css={styles}>{children}</BasicContainer>;
};

export default GridContainer;
