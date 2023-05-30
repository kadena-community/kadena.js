import { StyledList } from './styles';

import React, { FC } from 'react';

interface IProp {
  children: string;
}

export const UnorderedList: FC<IProp> = ({ children }) => {
  return <StyledList>{children}</StyledList>;
};
