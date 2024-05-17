import { Changelog } from '@/components/Changelog/Changelog';
import { getPageConfig } from '@/utils/config';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

const Home: FC = () => {
  return <Changelog />;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({
        filename: __filename,
      })),
      frontmatter: {
        title: 'Changelogs',
        menu: 'Changelogs',
        subTitle: 'Changelogs of all packages',
        label: 'Changelogs',
        order: 5,
        description: 'Changelogs',
        layout: 'landing',
      },
    },
  };
};

export default Home;
