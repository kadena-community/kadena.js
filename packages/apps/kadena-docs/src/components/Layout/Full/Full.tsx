import { Heading, styled } from '@kadena/react-components';

import { Article, Content } from '../components';
import { ILayout } from '../types';

import { AsideLink } from './AsideLink';
import { Aside, AsideList } from './style';
import { useCreateSubMenu } from './useCreateSubmenu';

import { ISubHeaderElement } from '@/types/Layout';
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
      <AsideLink href={`#${item.slug}`} key={item.slug} label={item.title}>
        {item.children.length > 0 && (
          <AsideList inner={true}>
            {item.children.map(renderListItem)}
          </AsideList>
        )}
      </AsideLink>
    );
  };

  return (
    <>
      <Content id="maincontent">
        <Article ref={docRef}>{children}</Article>

        <Aside>
          <StickyAsideWrapper>
            <StickyAside>
              <Heading as="h6" bold={true} transform="uppercase">
                On this page
              </Heading>
              <AsideList>{headers.map(renderListItem)}</AsideList>
            </StickyAside>
          </StickyAsideWrapper>
        </Aside>
      </Content>
    </>
  );
};

Full.displayName = 'Full';
