import { Stack } from '@kadena/react-ui';

import { InfiniteScroll } from '@/components';
import { BlogItem, BlogList } from '@/components/Blog';
import { Article, Content, TitleHeader } from '@/components/Layout/components';
import { getInitBlogPosts } from '@/hooks/useBlog/utils';
import { IMenuData, IPageProps } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import { GetStaticProps } from 'next';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
}

const BlogChainHome: FC<IProps> = ({ frontmatter, posts }) => {
  const [extraPosts, setExtraPosts] = useState<IMenuData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [isDone, setIsDone] = useState<boolean>(false);

  const limit = 10;
  const [offset, setOffset] = useState<number>(limit);

  const startReload = (): void => {
    if (isDone || error) return;
    setIsLoading(true);
  };
  const startRetry = (): void => {
    setError(undefined);
    startReload();
  };

  const handleLoad = useCallback(async (): Promise<void> => {
    if (isDone) return;
    try {
      const result = await fetch(`/api/blog?offset=${offset}&limit=${limit}`);
      const data = (await result.json()) as IMenuData[];
      setExtraPosts((v) => [...v, ...data]);
      setOffset((v) => v + limit);

      if (data.length < limit) {
        setIsDone(true);
      }
    } catch (e) {
      setIsLoading(false);
      setError('There was an issue, please try again later');
    }
  }, [setExtraPosts, setOffset, setIsLoading, setError, limit, offset, isDone]);

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading, extraPosts]);

  useEffect(() => {
    if (!isLoading) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const firstPost = posts.shift();
  return (
    <>
      <TitleHeader
        title={frontmatter.title}
        subTitle={frontmatter.subTitle}
        icon={frontmatter.icon}
      />
      <Content id="maincontent" layout="home">
        <Article>
          {firstPost && (
            <BlogList>
              <BlogItem key={firstPost.root} item={firstPost} />
            </BlogList>
          )}
          <Stack>
            <BlogList>
              {posts.map((item) => (
                <BlogItem key={item.root} item={item} />
              ))}
              {extraPosts.map((item) => (
                <BlogItem key={item.root} item={item} />
              ))}
              <InfiniteScroll
                handleLoad={startReload}
                handleRetry={startRetry}
                isLoading={isLoading}
                error={error}
                isDone={isDone}
              />
            </BlogList>
            <div>sidemenu</div>
          </Stack>
        </Article>
      </Content>
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
