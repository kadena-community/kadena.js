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
  headerFigureClass,
  headerImageClass,
  pageGridClass,
} from './styles.css';

import { AuthorProfileCard } from '@/components';
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
  const { readingTimeInMinutes, title, publishDate, authorInfo, headerImage } =
    frontmatter;
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
          <article
            className={articleClass}
            itemScope
            itemType="http://schema.org/BlogPosting"
          >
            <meta itemProp="datePublished" content={publishDate} />
            <meta itemProp="description" content={frontmatter.description} />
            <meta itemProp="headline" content={frontmatter.title} />

            {headerImage && (
              <figure className={headerFigureClass}>
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={headerImageClass}
                    src={headerImage}
                    alt={title}
                  />
                }
              </figure>
            )}
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
            <div itemProp="articleBody">{children}</div>

            <div className={bottomWrapperClass}>
              {authorInfo && <AuthorProfileCard author={authorInfo} />}
            </div>
          </article>
        </div>
      </Template>
    </div>
  );
};

Blog.displayName = 'Blog';
