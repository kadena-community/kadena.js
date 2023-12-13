import type { IMostPopularPage } from '@/MostPopularData';
import { HomeHeader } from '@/components/Layout/Landing/components';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { getBlogPosts } from '@/utils/getBlogPosts';
import getMostPopularPages from '@/utils/getMostPopularPages';
import type { IMenuData } from '@kadena/docs-tools';
import { checkSubTreeForActive, getPathName } from '@kadena/docs-tools';

import classNames from 'classnames';
import type { GetStaticProps } from 'next/types';

import type { FC } from 'react';
import React from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = () => {
  return (
    <>
      <HomeHeader popularPages={[]} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          asdfff doet ie het? rerenderd?
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mostPopularPages = await getMostPopularPages('/pact');
  const blogPosts = await getBlogPosts(['pact']);

  return {
    props: {
      popularPages: mostPopularPages,
      blogPosts,
      leftMenuTree: await checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Learn Pact',
        subTitle: 'The human-readable smart contract language',
        menu: 'Pact',
        label: 'Pact',
        order: 2,
        description: 'The human-readable smart contract language',
        layout: 'landing',
      },
    },
  };
};

export default Home;
