import { styled } from '@kadena/react-components';

import { Article, Content } from '../components/Main/styles';
import { ILayout } from '../types';

import { useCreateSubMenu } from './useCreateSubmenu';

import { ISubHeaderElement } from '@/types/Layout';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

const Aside = styled('aside', {
  display: 'none',
  width: '25%',
  '@md': {
    display: 'block',
  },
});

export const Full: FC<ILayout> = ({ children }) => {
  const { docRef, headers } = useCreateSubMenu();

  const renderListItem = (item: ISubHeaderElement): ReactNode => {
    return (
      <li key={item.slug}>
        <Link href={`#${item.slug}`}>{item.title}</Link>

        {item.children.length > 0 && (
          <ul>{item.children.map(renderListItem)}</ul>
        )}
      </li>
    );
  };

  return (
    <>
      <Content>
        <Article ref={docRef}>{children}</Article>

        <Aside>
          <ul>{headers.map(renderListItem)}</ul>
        </Aside>
      </Content>
    </>
  );
};

Full.displayName = 'Full';
