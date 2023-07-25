import { Stack } from '@kadena/react-components';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return <Stack>Error</Stack>;
};

export const getStaticProps: GetStaticProps = async () => {
  const leftMenuTree = await checkSubTreeForActive(getPathName(__filename));
  return {
    props: {
      leftMenuTree,
      frontmatter: {
        title: 'Welcome to Kadena docs',
        menu: 'Pact',
        label: 'Pact Test',
        order: 1,
        description: 'Home page',
        layout: 'home',
      },
    },
  };
};

export default Home;
