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

export const Code: FC<ILayout> = ({ children, isAsideOpen, editLink }) => {
  return (
    <>
      <Content id="maincontent">
        <Article>
          {children}
          <BottomPageSection editLink={editLink} />
        </Article>
      </Content>
      <CodeBackground isOpen={isAsideOpen} />

      <Aside layout="code" isOpen={isAsideOpen}>
        <StickyAsideWrapper>
          <StickyAside>
            <p>
              Tenetur quod quidem in voluptatem corporis dolorum dicta sit
              pariatur porro quaerat autem ipsam odit quam beatae tempora
              quibusdam illum! Modi velit odio nam nulla unde amet odit pariatur
              at!
            </p>
            <p>
              Consequatur rerum amet fuga expedita sunt et tempora saepe? Iusto
              nihil explicabo perferendis quos provident delectus ducimus
              necessitatibus reiciendis optio tempora unde earum doloremque
              commodi laudantium ad nulla vel odio?
            </p>
          </StickyAside>
        </StickyAsideWrapper>
      </Aside>
    </>
  );
};

Code.displayName = 'CodeSide';
