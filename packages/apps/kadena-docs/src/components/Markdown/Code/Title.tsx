import { StyledCode, StyledCodeWrapper } from './styles';

import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const TitleWrapper: FC<IProp> = ({ children, ...props }) => {
  if (props.hasOwnProperty('data-rehype-pretty-code-fragment')) {
    return <StyledCodeWrapper {...props}>{children}</StyledCodeWrapper>;
  }

  return <div {...props}>{children}</div>;
};
