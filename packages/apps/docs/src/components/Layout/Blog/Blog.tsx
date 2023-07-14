import { Article, Content } from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Blog: FC<ILayout> = ({ children, editLink, navigation }) => {
  return (
    <Content id="maincontent">
      <Article>
        {children}

        <BottomPageSection editLink={editLink} navigation={navigation} />
      </Article>
    </Content>
  );
};

Blog.displayName = 'Blog';
