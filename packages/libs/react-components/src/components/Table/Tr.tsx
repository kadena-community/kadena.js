import { StyledTr, Td, Th } from './styles';

import { StyledComponent } from '@stitches/react/types/styled-component';
import React, { FC, ReactNode } from 'react';

export interface ITR {
  children?: ReactNode;
}

export interface ITrComp {
  children?: ReactNode;
}
export interface ITr extends FC<ITrComp> {
  Td: StyledComponent<'td'>;
  Th: StyledComponent<'th'>;
}

// eslint-disable-next-line react/prop-types
export const Tr: ITr = ({ children }) => {
  return (
    <StyledTr>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Th && child.type !== Td)
        )
          return null;

        return child;
      })}
    </StyledTr>
  );
};

Tr.Th = Th;
Tr.Td = Td;
