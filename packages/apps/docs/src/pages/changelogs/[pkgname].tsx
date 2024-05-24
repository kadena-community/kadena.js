import { Package } from '@/components/Changelog/Package';
import changelogs from '@/data/changelogs.json';
import { REPOS } from '@/scripts/importChangelogs/constants';
import { getPageConfig } from '@/utils/config';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  pkg: IChangelogPackage;
}

const Home: FC<IProps> = ({ pkg }) => {
  return <Package pkg={pkg} />;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: REPOS.map((repo: IRepo) => ({
      params: { pkgname: repo.slug },
    })),
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<{}, { pkgname: string }> = async (
  ctx,
) => {
  const pkgname = ctx.params?.pkgname ?? '';

  return {
    props: {
      pkg: (changelogs as unknown as IChangelogComplete)[pkgname],
      ...(await getPageConfig({
        filename: __filename,
      })),
      frontmatter: {
        title: 'Changelogsd',
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
