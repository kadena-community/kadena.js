import { theme } from '@kadena/react-components';

import { Specs } from '@/components/Specs';
import apiSpecs from '@/specs/pact/pact.openapi.json';
import { ILayout } from '@/types/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import { OpenAPIV3 } from 'openapi-types';
import React, { FC } from 'react';

// sm: `(min-width: ${640 / 16}rem)`,
// md: `(min-width: ${768 / 16}rem)`,
// lg: `(min-width: ${1024 / 16}rem)`,
// xl: `(min-width: ${1280 / 16}rem)`,

const options = {
  pathInMiddlePanel: true,
  disableSearch: true,
  hideDownloadButton: true,
  hideLogo: true,
  hideFab: true,

  theme: {
    breakpoints: {
      small: '1024px',
      medium: '1280px',
    },
    rightPanel: {
      backgroundColor: 'transparent',
      width: '400px',
    },
    codeBlock: {
      backgroundColor: 'black',
      tokens: {
        keyword: {
          color: '#FAFAFA',
        },
      },
    },
    colors: {
      primary: {
        main: 'RGB(218,52,140)', // Kadena pink
      },
    },
  },
  expandResponses: '200,201,204',
};

const Home: FC<ILayout> = () => {
  const specs = apiSpecs as unknown as OpenAPIV3.Document;
  return <Specs specs={specs} options={options} />;
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
        layout: 'redocly',
      },
    },
  };
};

export default Home;
