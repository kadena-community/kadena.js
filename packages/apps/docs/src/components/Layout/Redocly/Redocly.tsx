import {
  Article,
  Aside,
  CodeBackground,
  Content,
  StickyAside,
  StickyAsideWrapper,
} from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Redocly: FC<ILayout> = ({
  children,
  isAsideOpen,
  editLink,
  navigation,
}) => {
  return (
    <>
      <Content id="maincontent" layout="code">
        <Article>
          {children}
          <BottomPageSection editLink={editLink} navigation={navigation} />
        </Article>
      </Content>
      <CodeBackground isOpen={isAsideOpen} />
    </>
  );
};

Redocly.displayName = 'Redocly';
