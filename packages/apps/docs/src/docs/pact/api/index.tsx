import apiSpecs from '@/_generated/specs/pact.openapi.json';
import { options } from '@/components/Layout/Redocly/Redocly';
import { Specs } from '@/components/Specs/Specs';
import { getPageConfig } from '@/utils/config';
import type { ILayout } from '@kadena/docs-tools';
import { Heading } from '@kadena/react-ui';
import type { GetStaticProps } from 'next';
import type { OpenAPIV3 } from 'openapi-types';
import type { FC } from 'react';
import React from 'react';

const Home: FC<ILayout> = () => {
  const specs = apiSpecs as unknown as OpenAPIV3.Document;
  return (
    <>
      <Heading as="h1">Pact OpenAPI</Heading>
      <Specs specs={specs} options={options} />;
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({ filename: __filename })),
      frontmatter: {
        title: 'Pact OpenAPI',
        menu: 'Docs',
        subTitle: 'Be a part of our ecosystem',
        label: 'Pact OpenAPI',
        order: 5,
        description: 'Be a part of our ecosystem',
        layout: 'redocly',
      },
    },
  };
};

export default Home;
