import { Content } from './components/Main/styles';
import { ILayout } from './types';

import React, { FC } from 'react';

export const CodeSide: FC<ILayout> = ({ children }) => {
  return <Content>{children}</Content>;
};

CodeSide.displayName = 'CodeSide';
