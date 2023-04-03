import { styled } from './../../styles';

import type { CSSProperties, VariantProps } from '@stitches/react';
import React, { FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  spacing?: VariantProps<typeof BasicContainer>['spacing'];
  templateRows?: CSSProperties['gridTemplateRows'];
  templateColumns?: CSSProperties['gridTemplateColumns'];
  templateAreas?: CSSProperties['gridTemplateAreas'];
}

// eslint-disable-next-line @kadena-dev/typedef-var
export const spacingVariants = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xs': {
    gridGap: '$2xs',
  },
  xs: {
    gridGap: '$xs',
  },
  sm: {
    gridGap: '$sm',
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
    gridGap: '$2xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3xl': {
    gridGap: '$3xl',
  },
} as const;

const BasicContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  defaultVariants: {
    spacing: '$md',
  },
  variants: {
    spacing: spacingVariants,
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
