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
//added for test purposes, because this package was breaking my build
import type { StreamMetaData } from '@7-docs/edge';
import { splitTextIntoSentences } from '@7-docs/edge';
import React, { FC, useEffect, useState } from 'react';

//added for test purposes, because this package was breaking my build
export interface IConversation {
  history: {
    metadata?: {
      input: string;
      output: string;
    }[];
  }[];
}

export const Code: FC<ILayout> = ({
  children,
  isAsideOpen,
  editLink,
  navigation,
}) => {
  const [metadata] = useState<undefined | StreamMetaData[]>();

  useEffect(() => {
    const interaction = {
      output: 'test',
    };
    const sentences = splitTextIntoSentences(interaction.output);
    console.log(sentences);
    console.log(metadata);
  }, [metadata]);

  return (
    <>
      <Content id="maincontent">
        <Article>
          {children}
          <BottomPageSection editLink={editLink} navigation={navigation} />
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
