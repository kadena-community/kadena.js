import type { IMenuData } from '@/Layout';
import { useGetBlogs } from '@/hooks/useGetBlogs/useGetBlogs';
import type { FC } from 'react';
import React from 'react';
import { BlogItem } from '../Blog/BlogItem/BlogItem';
import { BlogList } from '../Blog/BlogList';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';

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
