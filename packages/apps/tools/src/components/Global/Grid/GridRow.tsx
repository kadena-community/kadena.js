import { StyledGridRow } from './styles';

import type { FC, ReactNode } from 'react';
import React from 'react';

export interface IGridRowProps {
  className?: string;
  children: ReactNode;
}

const GridRow: FC<IGridRowProps> = ({ children, ...rest }) => (
  <StyledGridRow {...rest}>{children}</StyledGridRow>
);

export default GridRow;
