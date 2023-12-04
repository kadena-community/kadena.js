import { checkSubTreeForActive, getPathName } from '@kadena/docs-tools';
import { Heading } from '@kadena/react-ui';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

const Help: FC = () => {
  return <Heading as="h2">This will be the help page!</Heading>;
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: await checkSubTreeForActive(getPathName(__filename)),
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
