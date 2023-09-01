import { Heading, Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { type GetStaticProps } from 'next';
import React, { type FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" gap="$2xl">
      <div>
        <Heading as="h2">BlogChain 2023</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain 2023',
        menu: '2023',
        subTitle: '2023',
        label: '2023',
        order: 6,
        description: 'articles..articles...articles 2023',
        layout: 'landing',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
