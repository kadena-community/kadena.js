import { Heading, styled } from '@kadena/react-components';

import { Article, Content } from '../components';
import { ILayout } from '../types';

import { Aside } from './Aside';
import { useCreateSubMenu } from './useCreateSubmenu';

import { ISubHeaderElement } from '@/types/Layout';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

const StickyAsideWrapper = styled('div', {
  position: 'fixed',
  display: 'flex',
  top: '$20',
});

const StickyAside = styled('div', {
  position: 'sticky',
  top: '40px',
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
      <Content id="maincontent">
        <Article ref={docRef}>{children}</Article>

        <Aside>
          <StickyAsideWrapper>
            <StickyAside>
              <Heading as="h5">On this page</Heading>
              <ul>{headers.map(renderListItem)}</ul>
            </StickyAside>
          </StickyAsideWrapper>
        </Aside>
      </Content>
    </>
  );
};

Full.displayName = 'Full';
