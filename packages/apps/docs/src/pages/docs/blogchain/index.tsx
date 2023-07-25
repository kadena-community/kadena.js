import { Heading, Stack } from '@kadena/react-components';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="2xl">
      <div>
        <Heading as="h2">BlogChain</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain',
        menu: 'BlogChain',
        subTitle: 'articles..articles...articles',
        label: 'BlogChain',
        order: 7,
        description: 'articles..articles...articles',
        layout: 'home',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
