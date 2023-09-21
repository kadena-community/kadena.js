import { Stack } from '@kadena/react-ui';

import { TagList, TagListItem } from '@/components';
import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import type { IPageProps, ITag } from '@/types/Layout';
import { getAllBlogTags } from '@/utils';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  tags: ITag[];
}

const Home: FC<IProps> = ({ tags, frontmatter }) => {
  return (
    <>
      <TitleHeader title={frontmatter.title} subTitle={frontmatter.subTitle} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <Stack direction="column" gap="$2xl">
            <TagList>
              {tags?.map((tag) => <TagListItem key={tag.tag} {...tag} />)}
            </TagList>
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
      tags,
      frontmatter: {
        title: 'Tags',
        menu: 'all tags',
        label: 'overview',
        order: 0,
        layout: 'home',
      },
    },
  };
};

export default Home;
