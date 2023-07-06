import { Specs } from '@/components/Specs';
import specs from '@/specs/chainweb/chainweb.openapi.json';
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
  return {
    props: {
      specs,
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
