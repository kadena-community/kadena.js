import { Stack } from '@kadena/react-ui';

import { InfiniteScroll } from '@/components';
import { BlogItem, BlogList } from '@/components/Blog';
import {
  Article,
  articleClass,
  Content,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import { useGetBlogs } from '@/hooks';
import { getInitBlogPosts } from '@/hooks/useBlog/utils';
import { IMenuData, IPageProps } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import classNames from 'classnames';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
}

const BlogChainHome: FC<IProps> = ({ frontmatter, posts }) => {
  const {
    handleLoad,
    error,
    isLoading,
    isDone,
    data: extraPosts,
  } = useGetBlogs();

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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getInitBlogPosts(getData(), 0, 10);

  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename), true),
      posts,
      frontmatter: {
        title: 'BlogChain',
        menu: 'BlogChain',
        subTitle: 'The place where the blog meets the chain',
        label: 'BlogChain',
        order: 7,
        description: 'The place where the blog meets the chain',
        layout: 'home',
        icon: 'BlogChain',
      },
    },
  };
};

export default BlogChainHome;
