import { Box, Heading, Stack } from '@kadena/react-ui';

import { BlogPostsStrip } from '@/components/BlogPostsStrip';
import type { IMenuData } from '@/types/Layout';
import { getBlogPosts } from '@/utils/getBlogPosts';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = ({ blogPosts }) => {
  return (
    <Stack direction="column" gap="$2xl">
      <Box>
        <Heading as="h4">Latest Kadena posts</Heading>
        <BlogPostsStrip
          data={blogPosts}
          link={`/docs/tags/kadenajs`}
          linkLabel="More Build blogchain..."
        />
      </Box>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = await getBlogPosts(['kadenajs', 'cli']);

  return {
    props: {
      blogPosts,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Build on Kadena',
        menu: 'Build',
        subTitle: 'Build your best ideas with us',
        label: 'Introduction',
        order: 1,
        description: 'Build on Kadena',
        layout: 'landing',
        icon: 'Contribute',
      },
    },
  };
};

export default Home;
