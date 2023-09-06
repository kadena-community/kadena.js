import { Grid, Stack } from '@kadena/react-ui';

import { baseGridClass } from '../basestyles.css';
import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '../components';
import { Template } from '../components/Template';
import { globalClass } from '../global.css';

import { ArticleMetadataItem } from './ArticleMetadataItem';
import {
  articleTopMetadataClass,
  bottomWrapperClass,
  pageGridClass,
} from './styles.css';

import type { IPageProps } from '@/types/Layout';
import { formatDateDistance } from '@/utils/dates';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

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

  const gridClassNames = classNames(globalClass, baseGridClass, pageGridClass);

  return (
    <div className={gridClassNames}>
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
              <Grid.Root gap="$xl" columns={12}>
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
    </div>
  );
};

Blog.displayName = 'Blog';
