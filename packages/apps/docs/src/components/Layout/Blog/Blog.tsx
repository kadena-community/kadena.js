import { Stack } from '@kadena/react-ui';

import { Article, Content, TitleHeader } from '../components';
import { Template } from '../components/Template';

import { PageGrid } from './styles';

import { ArticleMetadataItem, ArticleTopMetadata } from './BlogStyles';

import { BottomPageSection } from '@/components/BottomPageSection';
import { IPageProps } from '@/types/Layout';
import { formatISODate } from '@/utils/dates';
import React, { FC } from 'react';

export const Blog: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  return (
    <PageGrid>
      <Template menuItems={leftMenuTree} hideSideMenu layout="landing">
        <TitleHeader
          title={frontmatter.title}
          subTitle={frontmatter.subTitle}
          icon={frontmatter.icon}
        />

        <Content id="maincontent">
          <Article>
            <Stack justifyContent="space-between">
              {frontmatter.publishDate && (
                <time dateTime={frontmatter.publishDate}>
                  {formatISODate(new Date(frontmatter.publishDate))}
                </time>
              )}
              <div>author: {frontmatter.author}</div>
            </Stack>
            {children}

            <BottomPageSection
              editLink={frontmatter.editLink}
              navigation={frontmatter.navigation}
            />
          </Article>
        </Content>
      </Template>
    </PageGrid>
  );
};

Blog.displayName = 'Blog';
