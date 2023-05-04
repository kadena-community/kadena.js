import { StyledCode, StyledCodeWrapper } from './styles';

import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const Pre: FC<IProp> = ({ children, ...props }) => {
  return <pre {...props}>{children}</pre>;
};
