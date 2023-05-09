import { Article, Content } from '../components';

import { NotFound } from '@/components/NotFound';
import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <Content id="maincontent">
      <Article>{children}</Article>

      <NotFound />
    </Content>
  );
};

Landing.displayName = 'Landing';
