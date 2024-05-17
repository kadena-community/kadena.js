import { Changelog } from '@/components/Changelog/Changelog';
import { getPageConfig } from '@/utils/config';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';
import changelogs from './../../data/changelogs.json';

interface IProps {
  changelogs: IChangelogComplete;
}

const Home: FC<IProps> = ({ changelogs }) => {
  return <Changelog changelogs={changelogs} />;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      changelogs,
      ...(await getPageConfig({
        filename: __filename,
      })),
      frontmatter: {
        title: 'Changelogs',
        menu: 'Changelogs',
        subTitle: 'Changelogs',
        label: 'Changelogs',
        order: 0,
        description: 'Changelogs',
        layout: 'landing',
      },
    },
  };
};

export default Home;
