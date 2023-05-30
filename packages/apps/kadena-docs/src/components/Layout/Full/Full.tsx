import { Heading } from '@kadena/react-components';

import {
  Article,
  Aside,
  AsideBackground,
  AsideLink,
  AsideList,
  Content,
  StickyAside,
  StickyAsideWrapper,
} from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout, ISubHeaderElement } from '@/types/Layout';
import { createSlug } from '@/utils';
import React, { FC, ReactNode } from 'react';

const renderListItem = (item: ISubHeaderElement): ReactNode => {
  if (item.title === undefined) return null;

  const slug = createSlug(item.title);
  return (
    <AsideLink href={`#${slug}`} key={slug} label={item.title}>
      {item.children.length > 0 && (
        <AsideList inner={true}>{item.children.map(renderListItem)}</AsideList>
      )}
    </AsideLink>
  );
};

export const Full: FC<ILayout> = ({ children, aSideMenuTree = [] }) => {
  return (
    <>
      <Content id="maincontent">
        <Article>
          {children}

          <BottomPageSection />
        </Article>
      </Content>

      <AsideBackground />
      <Aside data-cy="aside">
        {aSideMenuTree.length > 0 && (
          <StickyAsideWrapper>
            <StickyAside>
              <Heading as="h6" transform="uppercase">
                On this page
              </Heading>
              <AsideList>{aSideMenuTree.map(renderListItem)}</AsideList>
            </StickyAside>
          </StickyAsideWrapper>
        )}
      </Aside>
    </>
  );
};

Full.displayName = 'Full';
