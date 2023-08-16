import { Heading, Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="$2xl">
      <div>
        <Heading as="h2">BlogChain 2022</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'BlogChain 2022',
        menu: '2022',
        subTitle: '2022',
        label: '2022',
        order: 5,
        description: 'articles..articles...articles 2022',
        layout: 'landing',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
