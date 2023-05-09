import { GradientText as StyledText } from '../styles';

import React, { FC } from 'react';

export interface IGradientTextProps {
  children: React.ReactNode;
}

export const GradientText: FC<IGradientTextProps> = ({ children }) => {
  return <StyledText>{children}</StyledText>;
};
