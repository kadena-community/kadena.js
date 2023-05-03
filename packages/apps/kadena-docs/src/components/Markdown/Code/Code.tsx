import { StyledCode } from './styles';

import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  return (
    <StyledCode {...props} data-language="lisp">
      {children}
    </StyledCode>
  );
};
