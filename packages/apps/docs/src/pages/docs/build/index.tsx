import { Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

const Home: FC = () => {
  return <Stack direction="column" gap="$2xl"></Stack>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
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
