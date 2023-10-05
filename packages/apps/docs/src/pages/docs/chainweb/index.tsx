import { options } from '@/components/Layout/Redocly/Redocly';
import { Specs } from '@/components/Specs';
import apiSpecs from '@/specs/chainweb/chainweb.openapi.json';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
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
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Intro to Chainweb',
        menu: 'Chainweb',
        subTitle: 'Build the future on Kadena',
        label: 'Introduction',
        order: 5,
        description: "Welcome to Chainweb's documentation!",
        layout: 'redocly',
      },
    },
  };
};

export default Home;
