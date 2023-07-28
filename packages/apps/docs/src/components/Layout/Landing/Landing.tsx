import { Article, Content, TitleHeader } from '../components';
import { Template } from '../components/Template';

import { PageGrid } from './styles';

import { NotFound } from '@/components/NotFound';
import { IPageProps } from '@/types/Layout';
import React, { FC } from 'react';

export const Landing: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  return (
    <PageGrid>
      <Template menuItems={leftMenuTree} layout="landing">
        <TitleHeader
          title={frontmatter.title}
          subTitle={frontmatter.subTitle}
          icon={frontmatter.icon}
        />

        <Content id="maincontent" layout="code">
          <Article>
            {children}

            <NotFound />
          </Article>
        </Content>
      </Template>
    </PageGrid>
  );
};

Landing.displayName = 'Landing';
