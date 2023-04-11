import { styled } from '@kadena/react-components';

import { Footer, Header } from '@/components';
import { getLayout } from '@/utils';
import Head from 'next/head';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  markdoc: {
    frontmatter: {
      title: string;
      description: string;
      layout: 'code' | 'full' | 'landing';
    };
  };
}

const Template = styled('div', {
  display: 'grid',
  gridTemplateRows: '$17 1fr $17',
  gridTemplateAreas: `
    "header"
    "content"
    "footer"
  `,

  position: 'relative',
  minHeight: '100vh',
  '@md': {
    background: 'lightYellow',

    gridTemplateColumns: '256px 1fr',
    gridTemplateAreas: `
      "header header"
      "menu content"
      "footer footer"
    `,
  },
});

const Menu = styled('div', {
  gridArea: 'menu',
  position: 'absolute',
  top: '$17',
  background: 'blue',
  width: '100%',
  height: 'calc(100% - $17 - $17)',
  transform: 'translateX(-100%)',
  transition: 'transform .3s ease, width .3s ease',

  '@md': {
    position: 'relative',
    top: '0',
    height: '100%',
    width: '256px',
    transform: 'translateX(0)',
  },
});

export const Main: FC<IProps> = ({ children, markdoc }) => {
  let title, description;
  let layoutType = 'default';
  if (markdoc !== undefined) {
    title = markdoc.frontmatter.title;
    description = markdoc.frontmatter.description;
    layoutType = markdoc.frontmatter.layout ?? 'default';
  }

  const Layout = getLayout(layoutType);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>

      <Template>
        <Header />
        <Menu>
          menu
          <p>sdf</p>
          <p>sdf</p>
          <p>sdf</p>
        </Menu>
        <Layout>{children}</Layout>
        <Footer />
      </Template>
    </>
  );
};
