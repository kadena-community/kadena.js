import { Specs } from '@/components/Specs';
import { ILayout } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import { OpenAPIV3 } from 'openapi-types';
import React, { FC } from 'react';

interface IProps extends ILayout {
  specs: OpenAPIV3.Document;
}

const Home: FC<IProps> = ({ specs }) => {
  return <Specs specs={specs} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const specs = await import('../../../../specs/pact/pact.openapi.json');

  return {
    props: {
      specs: specs.default,
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
