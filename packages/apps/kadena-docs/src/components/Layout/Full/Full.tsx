import { Heading, styled } from '@kadena/react-components';

import { Article, Content } from '../components';
import { ILayout } from '../types';

import { Aside } from './Aside';
import { useCreateSubMenu } from './useCreateSubmenu';

import { ISubHeaderElement } from '@/types/Layout';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

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
      <Content id="maincontent">
        <Article ref={docRef}>{children}</Article>

        <Aside>
          <Heading as="h5">On this page</Heading>
          <ul>{headers.map(renderListItem)}</ul>
        </Aside>
      </Content>
    </>
  );
};

Full.displayName = 'Full';
