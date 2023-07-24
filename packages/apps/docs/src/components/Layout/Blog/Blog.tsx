import { Stack } from '@kadena/react-ui';

import { Article, Content } from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout } from '@/types/Layout';
import { formatISODate } from '@/utils/dates';
import React, { FC } from 'react';

export const Blog: FC<ILayout> = ({
  children,
  editLink,
  navigation,
  publishDate,
  author,
}) => {
  return (
    <Content id="maincontent">
      <Article>
        <Stack justifyContent="space-between">
          {publishDate && (
            <time dateTime={publishDate}>
              {formatISODate(new Date(publishDate))}
            </time>
          )}
          <div>author: {author}</div>
        </Stack>
        {children}

        <BottomPageSection editLink={editLink} navigation={navigation} />
      </Article>
    </Content>
  );
};

Blog.displayName = 'Blog';
