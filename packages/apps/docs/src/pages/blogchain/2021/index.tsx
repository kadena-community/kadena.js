import { BlogListWrapper } from '@/components/BlogList/BlogListWrapper';
import { TitleHeader } from '@/components/Layout/components/TitleHeader/TitleHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import { getPageConfig } from '@/utils/config';
import type { IMenuData, IPageProps } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
}

const Home: FC<IProps> = ({ frontmatter, posts }) => {
  return (
    <>
      <TitleHeader
        title={frontmatter.title}
        subTitle={frontmatter.description}
      />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <BlogListWrapper year={frontmatter.label} initPosts={posts} />
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const menuData: IMenuData[] = await getMenuData();
  const posts = getInitBlogPosts(menuData, 0, 10, {
    year: '2021',
  });

  return {
    props: {
      ...(await getPageConfig({ filename: __filename })),
      posts,
      frontmatter: {
        title: 'BlogChain 2021',
        menu: '2021',
        subTitle: '2021',
        label: '2021',
        order: 3,
        description: 'articles..articles...articles 2021',
        layout: 'home',
      },
    },
  };
};

export default Home;
