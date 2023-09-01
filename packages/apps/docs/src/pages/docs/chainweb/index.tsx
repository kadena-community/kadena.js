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
        <Heading as="h2">Chainweb</Heading>
      </div>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Intro to Chainweb',
        menu: 'Chainweb',
        subTitle: 'Build the future on Kadena',
        label: 'Introduction',
        order: 5,
        description: 'Welcome to Chainwebs documentation!',
        layout: 'landing',
        icon: 'Chainweb',
      },
    },
  };
};

export default Home;
