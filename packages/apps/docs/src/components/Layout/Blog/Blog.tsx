import { Grid, Stack } from '@kadena/react-ui';

import { Article, Content, TitleHeader } from '../components';
import { Template } from '../components/Template';

import {
  articleTopMetadataClass,
  bottomWrapperClass,
  relatedLinksContainer,
} from './Blog.css';
import { ArticleMetadataItem, PageGrid } from './styles';

import { IPageProps } from '@/types/Layout';
import { formatDateDistance } from '@/utils/dates';
import Link from 'next/link';
import React, { FC } from 'react';

export const Blog: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const { readingTimeInMinutes, publishDate, author } = frontmatter;
  const related = frontmatter.related || [];
  const readingTimeLabel =
    readingTimeInMinutes && readingTimeInMinutes > 1 ? 'minutes' : 'minute';

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
            <div className={articleTopMetadataClass}>
              <ArticleMetadataItem>
                {readingTimeInMinutes} {readingTimeLabel} read
              </ArticleMetadataItem>
              <ArticleMetadataItem>
                {publishDate && (
                  <time dateTime={publishDate}>
                    Published {formatDateDistance(new Date(publishDate))}
                  </time>
                )}
              </ArticleMetadataItem>
            </div>
            {children}

            <div className={bottomWrapperClass}>
              <Grid.Root spacing={'xl'} columns={12}>
                <Grid.Item columnSpan={4}>
                  <Stack
                    alignItems="flex-start"
                    justifyContent="space-between"
                    direction={'column'}
                  >
                    <span>
                      By <b>{author}</b>
                    </span>
                  </Stack>
                </Grid.Item>

                <Grid.Item columnSpan={8}>
                  {Boolean(related) && (
                    <Stack
                      alignItems="flex-start"
                      justifyContent="space-between"
                      direction={'column'}
                    >
                      <b>Other articles by {author}</b>
                      <ul className={relatedLinksContainer}>
                        {related.map((item, index) => (
                          <li key={index}>
                            <Link href={item.root}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </Stack>
                  )}
                </Grid.Item>
              </Grid.Root>
            </div>
          </Article>
        </Content>
      </Template>
    </PageGrid>
  );
};

Blog.displayName = 'Blog';
