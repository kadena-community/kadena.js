import { Article, Content, TitleHeader } from '../components';
import { Template } from '../components/Template';

import { ArticleMetadataItem, ArticleTopMetadata } from './BlogStyles';
import { PageGrid } from './styles';

import { BottomPageSection } from '@/components/BottomPageSection';
import { IPageProps } from '@/types/Layout';
import { formatDistance } from 'date-fns';
import React, { FC } from 'react';

export const Blog: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const { readingTimeInMinutes, publishDate, author } = frontmatter;

  return (
    <PageGrid>
      <Template menuItems={leftMenuTree} hideSideMenu layout="landing">
        <TitleHeader
          title="BlogChain"
          subTitle="The place where the blog meets the chain"
          icon="BlogChain"
        />

        <Content id="maincontent">
          <Article>
            <ArticleTopMetadata>
              <ArticleMetadataItem>
                <span>{readingTimeInMinutes} minutes read</span>
              </ArticleMetadataItem>
              <ArticleMetadataItem>
                {publishDate && (
                  <time dateTime={publishDate}>
                    Published{' '}
                    {formatDistance(new Date(publishDate!), new Date())}
                  </time>
                )}
              </ArticleMetadataItem>
              <ArticleMetadataItem>By {author}</ArticleMetadataItem>
            </ArticleTopMetadata>
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
