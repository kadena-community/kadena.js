import { StyledCode, StyledInlineCode } from './styles';

import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  if (typeof children === 'string') {
    return <StyledInlineCode>{children}</StyledInlineCode>;
  }

  return <StyledCode {...props}>{children}</StyledCode>;
};
