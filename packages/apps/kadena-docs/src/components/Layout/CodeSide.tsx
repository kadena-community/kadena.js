import { Content } from './components';
import { ILayout } from './types';

import React, { FC } from 'react';

export const CodeSide: FC<ILayout> = ({ children }) => {
  return <Content id="maincontent">{children}</Content>;
};

CodeSide.displayName = 'CodeSide';
