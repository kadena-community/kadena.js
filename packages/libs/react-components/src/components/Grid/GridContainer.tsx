import {
  IGridContainerProps,
  IGridContainerStyles,
  IGridContainerStylesReturned,
} from '../../typings';
import { createSResponsiveStyles } from '../../utils';

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
  // const styles = createSResponsiveStyles<
  //   IGridContainerStyles,
  //   IGridContainerStylesReturned
  // >({
  //   gridGap: gap,
  //   gridTemplateAreas: templateAreas,
  //   gridTemplateRows: templateRows,
  //   gridTemplateColumns: templateColumns,
  // });

  const styles = {};
  return <BasicContainer css={styles}>{children}</BasicContainer>;
};

export default GridContainer;
