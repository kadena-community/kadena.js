import { Specs } from '@/components/Specs';
import apiSpecs from '@/specs/chainweb/chainweb.openapi.json';
import { ILayout } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import { OpenAPIV3 } from 'openapi-types';
import React, { FC } from 'react';

const Home: FC<ILayout> = () => {
  const specs = apiSpecs as unknown as OpenAPIV3.Document;
  return <Specs specs={specs} />;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Chainweb',
        menu: 'Chainweb',
        subTitle: 'Be a part of our ecosystem',
        label: 'Chainweb',
        order: 5,
        description: 'Be a part of our ecosystem',
        layout: 'home',
        icon: 'Chainweb',
      },
    },
  };
};

export default Home;
