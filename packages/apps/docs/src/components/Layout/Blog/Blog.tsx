import { Grid, Stack } from '@kadena/react-ui';

import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '../components';
import { Template } from '../components/Template';
import { globalsClass } from '../global.css';

import { articleTopMetadataClass, bottomWrapperClass } from './Blog.css';
import { ArticleMetadataItem, PageGrid } from './styles';

import { IPageProps } from '@/types/Layout';
import { formatDateDistance } from '@/utils/dates';
import classNames from 'classnames';
import React, { FC } from 'react';

export const Blog: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const { readingTimeInMinutes, publishDate, author } = frontmatter;
  const readingTimeLabel =
    readingTimeInMinutes && readingTimeInMinutes > 1 ? 'minutes' : 'minute';

  const contentClassNames = classNames(
    contentClass,
    contentClassVariants[frontmatter.layout] ?? '',
  );

  return (
    <PageGrid className={globalsClass}>
      <Template menuItems={leftMenuTree} hideSideMenu layout="landing">
        <TitleHeader
          title="BlogChain"
          subTitle="The place where the blog meets the chain"
          icon="BlogChain"
        />

        <div id="maincontent" className={contentClassNames}>
          <article className={articleClass}>
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
              <Grid.Root spacing="$xl" columns={12}>
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
              </Grid.Root>
            </div>
          </article>
        </div>
      </Template>
    </PageGrid>
  );
};

Blog.displayName = 'Blog';
