import { BlogListWrapper } from '@/components/BlogList/BlogListWrapper';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { TitleHeader } from '@/components/Layout/components/TitleHeader/TitleHeader';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import type { IMenuData, IPageProps } from '@/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from '@/utils/staticGeneration/getData.mjs';
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
  const posts = getInitBlogPosts(getData() as IMenuData[], 0, 10, {
    year: '2023',
  });

  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      posts,
      frontmatter: {
        title: 'BlogChain 2023',
        menu: '2023',
        subTitle: '2023',
        label: '2023',
        order: 3,
        description: 'articles..articles...articles 2023',
        layout: 'home',
      },
    },
  };
};

export default Home;
