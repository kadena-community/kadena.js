import type { CSSProperties, VariantProps } from '@stitches/react';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { GridContainer as BaseContainer } from './styles';

export interface IGridContainerProps {
  children?: ReactNode;
  gap?: VariantProps<typeof BaseContainer>['gap'];
  templateRows?: CSSProperties['gridTemplateRows'];
  templateColumns?: CSSProperties['gridTemplateColumns'];
  templateAreas?: CSSProperties['gridTemplateAreas'];
}

const GridContainer: FC<IGridContainerProps> = ({
  children,
  gap,
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
    <BaseContainer css={styles} gap={gap}>
      {children}
    </BaseContainer>
  );
};

export default GridContainer;
