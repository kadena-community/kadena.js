import { StyledTr, Td, Th } from './styles';
import type { CompoundType } from './types';

import type { FC } from 'react';
import React from 'react';

export interface ITr {
  children?: CompoundType<typeof Td> | CompoundType<typeof Th>;
}
export interface ITrComp extends FC<ITr> {
  Td: typeof Td;
  Th: typeof Th;
}

// eslint-disable-next-line react/prop-types
export const Tr: ITrComp = ({ children }) => {
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
