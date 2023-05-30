import { StyledList } from './styles';

import React, { FC } from 'react';

interface IProp {
  children: string;
}

export const UnorderdList: FC<IProp> = ({ children }) => {
  return <StyledList>{children}</StyledList>;
};
