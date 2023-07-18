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
        order: 1,
        description: 'articles..articles...articles 2021',
        layout: 'landing',
        icon: 'BlogChain',
      },
    },
  };
};

export default Home;
