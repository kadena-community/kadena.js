import { styled } from '@kadena/react-components';

import { ILayout } from './types';

import React, { FC } from 'react';

const Content = styled('div', {
  display: 'flex',
  gridArea: 'content',

  flex: 1,
});

const Aside = styled('aside', {
  display: 'none',
  width: '25%',
  '@md': {
    display: 'block',
  },
});
const Article = styled('div', {
  flex: 1,
  borderLeft: '3px solid black',
});

export const Full: FC<ILayout> = ({ children }) => {
  return (
    <>
      <Content>
        <Article>{children}</Article>

        <Aside>aside</Aside>
      </Content>
    </>
  );
};

Full.displayName = 'Full';
