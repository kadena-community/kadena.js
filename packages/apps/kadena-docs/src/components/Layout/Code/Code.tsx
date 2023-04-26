import {
  Article,
  Aside,
  CodeBackground,
  CodeBackgroundOverlay,
  Content,
} from './styles';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Code: FC<ILayout> = ({ children }) => {
  return (
    <>
      <Content id="maincontent">
        <Article>{children}</Article>
      </Content>
      <CodeBackground />
      <CodeBackgroundOverlay />
      <Aside>code</Aside>
    </>
  );
};

Code.displayName = 'CodeSide';
