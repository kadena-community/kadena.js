import { GridContainer as BaseContainer } from './styles';

import type { CSSProperties, VariantProps } from '@stitches/react';
import React, { FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  spacing?: VariantProps<typeof BaseContainer>['spacing'];
  templateRows?: CSSProperties['gridTemplateRows'];
  templateColumns?: CSSProperties['gridTemplateColumns'];
  templateAreas?: CSSProperties['gridTemplateAreas'];
}

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
    <BaseContainer css={styles} spacing={spacing}>
      {children}
    </BaseContainer>
  );
};

export default GridContainer;
