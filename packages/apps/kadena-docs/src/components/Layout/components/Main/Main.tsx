import { Menu, Template } from './styles';

import { Footer, Header } from '@/components';
import { getLayout } from '@/utils';
import Head from 'next/head';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  ref?: React.ForwardedRef<HTMLDivElement>;
  markdoc: {
    frontmatter: {
      title: string;
      description: string;
      layout: 'code' | 'full' | 'landing';
    };
  };
}

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
