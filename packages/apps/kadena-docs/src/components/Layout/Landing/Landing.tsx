import { Article } from '../Code/styles';

import { Content } from './styles';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <Content id="maincontent">
      <Article>{children}</Article>
    </Content>
  );
};

Landing.displayName = 'Landing';
