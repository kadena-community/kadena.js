import { StyledTHead } from './styles';
import { ITr, Tr } from './Tr';

import React, { FC, FunctionComponentElement } from 'react';

export interface ITHead {
  children?: FunctionComponentElement<ITr> | FunctionComponentElement<ITr>[];
}

export const THead: FC<ITHead> = ({ children }) => {
  return (
    <StyledTHead>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Tr)
        )
          return null;

        return child;
      })}
    </StyledTHead>
  );
};
