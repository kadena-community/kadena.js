import { AuthorProfileCard } from '@/components/AuthorProfileCard/AuthorProfileCard';
import { formatDateDistance } from '@/utils/dates';
import type { IPageProps } from '@kadena/docs-tools';
import { TagGroup, TagItem } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template/Template';
import { TitleHeader } from '../components/TitleHeader/TitleHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '../components/articleStyles.css';
import { globalClass } from '../global.css';
import { ArticleMetadataItem } from './ArticleMetadataItem';
import {
  articleTopMetadataClass,
  bottomWrapperClass,
  headerFigureClass,
  headerImageClass,
  pageGridClass,
} from './styles.css';

export const Blog: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const {
    readingTimeInMinutes,
    title,
    publishDate,
    authorInfo,
    headerImage,
    tags,
  } = frontmatter;
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
              <ArticleMetadataItem>
                {tags && (
                  <TagGroup tagAsChild aria-label={`${title} Tags`}>
                    {tags.map((tag: string) => (
                      <TagItem key={tag} aria-label={`${tag} Link`}>
                        <Link key={tag} href={`/tags/${tag}`}>
                          {tag}
                        </Link>
                      </TagItem>
                    ))}
                  </TagGroup>
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
