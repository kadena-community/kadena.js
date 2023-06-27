import { StyledGridCol } from './styles';

import { IGridColMediaStyles, IGridColMediaType } from '@/types/Grid';
import { getColumnStyles } from '@/utils/styles';
import React, { FC, ReactNode } from 'react';

export interface IGridRowProps {
  xs?: IGridColMediaType;
  sm?: IGridColMediaType;
  md?: IGridColMediaType;
  lg?: IGridColMediaType;
  xl?: IGridColMediaType;
  xxl?: IGridColMediaType;
  className?: string;
  children: ReactNode;
}

const GridCol: FC<IGridRowProps> = ({
  children,
  className,
  xs = {},
  sm = {},
  md = {},
  lg = {},
  xl = {},
  xxl = {},
}) => {
  const css: { [key: string]: IGridColMediaStyles } = {};
  css['@sm'] = getColumnStyles(sm);
  css['@md'] = getColumnStyles(md);
  css['@lg'] = getColumnStyles(lg);
  css['@xl'] = getColumnStyles(xl);
  css['@2xl'] = getColumnStyles(xxl);

  return (
    <StyledGridCol
      className={className}
      css={{ ...getColumnStyles(xs), ...css }}
    >
      {children}
    </StyledGridCol>
  );
};

export default GridCol;
