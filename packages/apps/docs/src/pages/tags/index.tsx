import { Stack } from '@kadena/react-ui';

import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import type { IPageProps } from '@/types/Layout';
import { getAllBlogTags } from '@/utils';
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
  tags: string[];
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
            <ul>
              {frontmatter.tags?.map((tag) => (
                <li key={tag}>
                  <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                </li>
              ))}
            </ul>
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const tags = getAllBlogTags();
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        tags,
        title: 'Tags',
        menu: 'all tags',
        label: 'overview',
        order: 0,
        layout: 'home',
        icon: 'Concepts',
      },
    },
  };
};

export default Home;
