import { Specs } from '@/components/Specs';
import apiSpecs from '@/specs/pact/pact.openapi.json';
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
        title: 'Pact OpenAPI',
        menu: 'Docs',
        subTitle: 'Be a part of our ecosystem',
        label: 'Pact OpenAPI',
        order: 5,
        description: 'Be a part of our ecosystem',
        layout: 'home',
      },
    },
  };
};

export default Home;
