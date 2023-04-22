import { Heading } from '@kadena/react-components';

import { Article, Content } from '../components';
import { SideBackground } from '../components/Background';

import { AsideLink } from './AsideLink';
import {
  Aside,
  AsideList,
  SideBackgroundWrapper,
  StickyAside,
  StickyAsideWrapper,
} from './style';
import { useCreateSubMenu } from './useCreateSubmenu';

import { ILayout, ISubHeaderElement } from '@/types/Layout';
import React, { FC, ReactNode } from 'react';

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

        <SideBackgroundWrapper>
          <SideBackground />
        </SideBackgroundWrapper>
        <Aside>
          <StickyAsideWrapper>
            <StickyAside>
              <Heading as="h6" transform="uppercase">
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
