import { Heading, Stack, Text } from '@kadena/react-components';

import { BrowseSection } from '@/components';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="2xl">
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
        order: 0,
        description: 'Welcome to Chainwebs documentation!',
        layout: 'landing',
        icon: 'QuickStart',
      },
    },
  };
};

export default Home;
