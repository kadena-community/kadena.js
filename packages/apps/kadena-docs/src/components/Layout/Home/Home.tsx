import { Article, Content } from '../components';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Home: FC<ILayout> = ({ children }) => {
  return (
    <Content id="maincontent" layout="home">
      <Article>{children}</Article>
    </Content>
  );
};

Home.displayName = 'Home';
