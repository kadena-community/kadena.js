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
import React, { FC, useState } from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
}

const BlogChainHome: FC<IProps> = ({ frontmatter, posts }) => {
  const [extraPosts, setExtraPosts] = useState<IMenuData[]>([]);

  const handleLoad = async (): Promise<void> => {
    const result = await fetch('/api/blog?offset=10&limit=10');
    const data = (await result.json()) as IMenuData[];

    setExtraPosts((v) => [...v, ...data]);
  };

  return (
    <>
      <TitleHeader
        title={frontmatter.title}
        subTitle={frontmatter.subTitle}
        icon={frontmatter.icon}
      />
      <Content id="maincontent" layout="home">
        <Article>
          <BlogList>
            {posts.map((item) => (
              <BlogItem key={item.root} item={item} />
            ))}
            {extraPosts.map((item) => (
              <BlogItem key={item.root} item={item} />
            ))}
            <InfiniteScroll handleLoad={handleLoad} />
          </BlogList>
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
