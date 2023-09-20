import { Card, Stack } from '@kadena/react-ui';

import { AuthorList, AuthorListItem, AuthorProfileCard } from '@/components';
import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import authorsData from '@/data/authors.json';
import type { IAuthorInfo, IPageProps } from '@/types/Layout';
import { getLatestBlogPostsOfAuthor } from '@/utils';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  authors: IAuthorInfo[];
}

const Home: FC<IProps> = ({ frontmatter, authors }) => {
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
            <AuthorList>
              {authors.map((author) => (
                <AuthorListItem key={author.id}>
                  <Card fullWidth>
                    <AuthorProfileCard author={author} />
                  </Card>
                </AuthorListItem>
              ))}
            </AuthorList>
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const authors = authorsData
    .sort((a, b) => {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    })
    .map((author) => {
      return { ...author, posts: getLatestBlogPostsOfAuthor(author) };
    }) as IAuthorInfo[];

  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      authors,
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
