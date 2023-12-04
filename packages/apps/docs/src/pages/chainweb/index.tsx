import apiSpecs from '@/_generated/specs/chainweb.openapi.json';
import { options } from '@/components/Layout/Redocly/Redocly';
import { Specs } from '@/components/Specs/Specs';
import { checkSubTreeForActive, getPathName } from '@kadena/docs-tools';
import type { GetStaticProps } from 'next';
import type { OpenAPIV3 } from 'openapi-types';
import type { FC } from 'react';
import React from 'react';

const Home: FC = () => {
  const specs = apiSpecs as unknown as OpenAPIV3.Document;
  return <Specs specs={specs} options={options} />;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: await checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Intro to Chainweb',
        menu: 'Chainweb',
        subTitle: 'Build the future on Kadena',
        label: 'Introduction',
        order: 5,
        description: 'Welcome to Chainwebs documentation!',
        layout: 'redocly',
      },
    },
  };
};

export default Home;
