import { BlogItem, BlogList } from '../Blog';
import { InfiniteScroll } from '../InfiniteScroll';

import { useGetBlogs } from '@/hooks';
import type { IMenuData } from '@/types/Layout';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  authorId?: string;
  year?: string;
  tagId?: string;
  initPosts: IMenuData[];
}

export const BlogListWrapper: FC<IProps> = ({
  authorId,
  year,
  tagId,
  initPosts,
}) => {
  const {
    handleLoad,
    error,
    isLoading,
    isDone,
    data: extraPosts,
  } = useGetBlogs({ authorId, year, tagId });

  const startRetry = (isRetry: boolean = false): void => {
    handleLoad(isRetry);
  };

  return (
    <BlogList>
      {initPosts.map((item) => (
        <BlogItem key={item.root} item={item} />
      ))}
      {extraPosts.map((item) => (
        <BlogItem key={item.root} item={item} />
      ))}
      <InfiniteScroll
        handleLoad={startRetry}
        isLoading={isLoading}
        error={error}
        isDone={isDone}
      />
    </BlogList>
  );
};
