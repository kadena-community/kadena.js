import { GradientText as StyledText } from './styles';

import React, { FC } from 'react';

export interface IGradientTextProps {
  as?: 'span';
  children: React.ReactNode;
}

export const GradientText: FC<IGradientTextProps> = ({ as, children }) => {
  return <StyledText as={as}>{children}</StyledText>;
};
