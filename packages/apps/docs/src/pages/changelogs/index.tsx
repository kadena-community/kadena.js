import { Changelog } from '@/components/Changelog/Changelog';
import changelogs from '@/data/changelogs.json';
import {
  getPackages,
  getVersions,
} from '@/scripts/importChangelogs/utils/misc';
import { getPageConfig } from '@/utils/config';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  changelogs: IChangelogComplete;
}

const Home: FC<IProps> = ({ changelogs }) => {
  return <Changelog changelogs={changelogs} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const newChangelogs = getPackages(
    changelogs as unknown as IChangelogComplete,
  ).map((pkg) => {
    const versions = getVersions(pkg);
    return {
      ...pkg,
      versionCount: versions.length,
      content: versions.slice(0, 4),
    };
  });

  return {
    props: {
      changelogs: newChangelogs,
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
