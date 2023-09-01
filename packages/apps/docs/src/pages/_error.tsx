import { Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { type GetStaticProps } from 'next';
import React, { type FC } from 'react';

const Home: FC = () => {
  return <Stack>Error</Stack>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
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
