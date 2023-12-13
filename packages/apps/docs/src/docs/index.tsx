import type { IMostPopularPage } from '@/MostPopularData';
import { HomeHeader } from '@/components/Layout/Landing/components';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import type { IMenuData } from '@kadena/docs-tools';

import classNames from 'classnames';
import type { GetStaticProps } from 'next/types';

import type { FC } from 'react';
import React from 'react';
import { getPageConfig } from '../utils/config';

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
  return {
    props: {
      ...(await getPageConfig({ blogPosts: ['pact'], popularPages: '/pact' })),
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
