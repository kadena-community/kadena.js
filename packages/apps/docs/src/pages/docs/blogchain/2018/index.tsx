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
        <Heading as="h2">BlogChain 2018</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain 2018',
        menu: '2018',
        subTitle: '2018',
        label: '2018',
        order: 1,
        description: 'articles..articles...articles 2018',
        layout: 'landing',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
