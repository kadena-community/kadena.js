import type { IMenuItem } from '@/Layout';
import { ErrorHeader } from '@/components/Layout/Landing/components/Headers/ErrorHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { getAllPages } from '@/utils/config';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import classNames from 'classnames';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

const WildCardPage: FC = () => {
  const router = useRouter();

  console.log({ router });

  return (
    <>
      <ErrorHeader
        title="Not Found"
        subTitle="we couldn't find what you were looking for"
        body="Maybe these results can help you?"
      ></ErrorHeader>
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>what?</article>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  //const posts = getAllPages();
  //console.log(posts);
  return {
    paths: [
      {
        params: {
          id: ['pages', 'test', 'build'],
        },
      },
      {
        params: {
          id: ['pages', 'test'],
        },
      },
    ],
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: [],
      frontmatter: {
        title: 'wildcard',
        menu: '404 - Not found',
        label: '404 - Not found',
        order: 0,
        description: 'Sorry, we did not find what you were looking for',
        layout: 'home',
        lastModifiedDate: new Date().toLocaleDateString(),
      },
    },
  };
};

export default WildCardPage;
