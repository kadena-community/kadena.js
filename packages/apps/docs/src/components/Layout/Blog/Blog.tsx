import { Article, Content } from '../components';

import { ArticleMetadataItem, ArticleTopMetadata } from './BlogStyles';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout } from '@/types/Layout';
import formatDistance from 'date-fns/formatDistance';
import React, { FC, useEffect } from 'react';

// read time calculation
// calculations based on this article: https://infusion.media/content-marketing/how-to-calculate-reading-time/
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s/g).length;
  const minutes = numberOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
}

export const Blog: FC<ILayout> = ({
  children,
  editLink,
  navigation,
  publishDate,
  author,
}) => {
  const [readTime, setReadTime] = React.useState(0);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) {
      return;
    }

    const text = article.textContent;
    if (!text) {
      return;
    }
    setReadTime(calculateReadingTime(text));
  }, []);

  return (
    <Content id="maincontent">
      <Article>
        <ArticleTopMetadata>
          <ArticleMetadataItem>
            <span>{readTime} minutes read</span>
          </ArticleMetadataItem>
          <ArticleMetadataItem>
            {publishDate && (
              <time dateTime={publishDate}>
                Published {formatDistance(new Date(publishDate!), new Date())}
              </time>
            )}
          </ArticleMetadataItem>
          <ArticleMetadataItem>By {author}</ArticleMetadataItem>
        </ArticleTopMetadata>
        {children}

        <BottomPageSection editLink={editLink} navigation={navigation} />
      </Article>
    </Content>
  );
};

Blog.displayName = 'Blog';
