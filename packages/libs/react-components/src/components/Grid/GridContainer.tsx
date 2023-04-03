import { styled } from './../../styles';
import * as variants from './variants';

import type { CSSProperties, VariantProps } from '@stitches/react';
import React, { FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  spacing?: VariantProps<typeof BasicContainer>['spacing'];
  templateRows?: CSSProperties['gridTemplateRows'];
  templateColumns?: CSSProperties['gridTemplateColumns'];
  templateAreas?: CSSProperties['gridTemplateAreas'];
}

const BasicContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  defaultVariants: {
    spacing: '$md',
  },
  variants: {
    spacing: variants.spacing,
  },
});

const GridContainer: FC<IGridContainerProps> = ({
  children,
  spacing,
  templateAreas,
  templateRows,
  templateColumns,
}) => {
  const styles = {
    gridTemplateAreas: templateAreas,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns,
  };
  return (
    <BasicContainer css={styles} spacing={spacing}>
      {children}
    </BasicContainer>
  );
};

export default GridContainer;
