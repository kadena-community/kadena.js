import { styled } from '@kadena/react-components';

import React, { FC } from 'react';

interface IProp {
  children: string;
}

const StyledList = styled('ul', {
  margin: '$5 0',
  '& li::marker': {
    color: '$primaryHighContrast',
    fontWeight: '$bold',
  },
});

export const UnorderdList: FC<IProp> = ({ children }) => {
  return <StyledList>{children}</StyledList>;
};
