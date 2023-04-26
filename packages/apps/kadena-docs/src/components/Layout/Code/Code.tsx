import { Article, Aside, CodeBackground, Content } from './styles';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Code: FC<ILayout> = ({ children }) => {
  return (
    <>
      <Content id="maincontent">
        <Article>{children}</Article>
      </Content>
      <CodeBackground layout="code" />

      <Aside>code</Aside>
    </>
  );
};

Code.displayName = 'CodeSide';
