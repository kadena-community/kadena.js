import { Article, Content } from '../components';

import { NotFound } from '@/components/NotFound';
import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <Content id="maincontent" layout="code">
      <Article>
        {children}

        <NotFound />
      </Article>
    </Content>
  );
};

Landing.displayName = 'Landing';
