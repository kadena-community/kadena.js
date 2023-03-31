import { styled } from './../../styles';

import type * as Stitches from '@stitches/react';
import React, { FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  spacing?: Stitches.VariantProps<typeof BasicContainer>['spacing'];
  templateRows?: Stitches.CSSProperties['gridTemplateRows'];
  templateColumns?: Stitches.CSSProperties['gridTemplateColumns'];
  templateAreas?: Stitches.CSSProperties['gridTemplateAreas'];
}

const BasicContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridGap: '$md',
  variants: {
    spacing: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '2xs': {
        gridGap: '$2xs',
      },
      xs: {
        gridGap: '$xs',
      },
      sm: {
        gridGap: '$3',
      },
      md: {
        gridGap: '$md',
      },
      lg: {
        gridGap: '$lg',
      },
      xl: {
        gridGap: '$xl',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '2xl': {
        gap: '$2xl',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '3xl': {
        gap: '$3xl',
      },
    },
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
