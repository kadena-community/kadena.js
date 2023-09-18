import { Stack } from '@kadena/react-ui';

import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import authors from '@/data/authors.json';
import type { IAuthorInfo, IMenuData, IPageProps } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
}

const Home: FC<IProps> = ({ frontmatter }) => {
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
          <Stack direction="column" gap="$2xl">
            <div>
              {authors
                .sort((a, b) => {
                  if (a.id > b.id) return 1;
                  if (a.id < b.id) return -1;
                  return 0;
                })
                .map((author: IAuthorInfo) => (
                  <li key={author.id}>
                    <Link
                      href={`/docs/blogchain/authors/${encodeURIComponent(
                        author.id,
                      )}`}
                    >
                      {author.name}
                    </Link>
                  </li>
                ))}
            </div>
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain authors',
        menu: 'authors Overview',
        label: 'overview',
        order: 0,
        description: 'who is writing our blogchain posts?',
        layout: 'home',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
