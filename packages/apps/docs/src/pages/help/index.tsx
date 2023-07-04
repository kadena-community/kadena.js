import { Heading } from '@kadena/react-components';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Help: FC = () => {
  return <Heading as="h2">This will be the help page!</Heading>;
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Help',
        menu: 'Help',
        label: 'Help',
        order: 0,
        description: 'How to find stuff?',
        layout: 'landing',
      },
    },
  };
};

export default Help;
