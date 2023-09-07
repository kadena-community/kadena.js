import { Heading, Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" gap="$2xl">
      <div>
        <Heading as="h2">BlogChain 2021</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain 2021',
        menu: '2021',
        subTitle: '2021',
        label: '2021',
        order: 4,
        description: 'articles..articles...articles 2021',
        layout: 'landing',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
