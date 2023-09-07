import { Stack } from '@kadena/react-ui';

import { InfiniteScroll } from '@/components';
import { BlogItem, BlogList } from '@/components/Blog';
import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import authors from '@/data/authors.json';
import { useGetBlogs } from '@/hooks';
import { getInitBlogPosts } from '@/hooks/useBlog/utils';
import type { IAuthorInfo, IMenuData, IPageProps } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import classNames from 'classnames';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
}

const Home: FC<IProps> = ({ frontmatter, posts }) => {
  const { query } = useRouter();
  const { authorId } = query as { authorId: string };

  const {
    handleLoad,
    error,
    isLoading,
    isDone,
    data: extraPosts,
  } = useGetBlogs({ authorId });

  const startRetry = (isRetry: boolean = false): void => {
    handleLoad(isRetry);
  };

  const [firstPost, ...allPosts] = posts;

  return (
    <>
      <TitleHeader
        title={frontmatter.title}
        subTitle={frontmatter.subTitle}
        icon={frontmatter.icon}
      />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          {firstPost && (
            <BlogList>
              <BlogItem key={firstPost.root} item={firstPost} />
            </BlogList>
          )}
          <Stack>
            <BlogList>
              {allPosts.map((item) => (
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
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: authors.map((author: IAuthorInfo) => ({
      params: { authorId: author.id },
    })),
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<{}, { authorId: string }> = async (
  ctx,
) => {
  const authorId = ctx.params?.authorId;

  const posts = getInitBlogPosts(getData(), 0, 10, { authorId });

  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      posts,
      frontmatter: {
        title: 'BlogChain authors',
        menu: 'authors',
        label: 'authors',
        order: 0,
        description: 'who is writing our blogchain posts?',
        layout: 'home',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
