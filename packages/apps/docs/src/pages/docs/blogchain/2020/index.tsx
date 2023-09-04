import { Heading, Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" gap="$2xl">
      <div>
        <Heading as="h2">BlogChain 2020</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain 2020',
        menu: '2020',
        subTitle: '2020',
        label: '2020',
        order: 3,
        description: 'articles..articles...articles 2020',
        layout: 'landing',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
