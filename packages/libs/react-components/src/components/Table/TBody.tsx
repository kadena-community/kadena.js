import { StyledTBody } from './styles';
import { ITr, Tr } from './Tr';

import React, { FC, FunctionComponentElement } from 'react';

export interface ITBody {
  children?: FunctionComponentElement<ITr> | FunctionComponentElement<ITr>[];
}

export const TBody: FC<ITBody> = ({ children }) => {
  return (
    <StyledTBody>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Tr)
        )
          return null;

        return child;
      })}
    </StyledTBody>
  );
};
