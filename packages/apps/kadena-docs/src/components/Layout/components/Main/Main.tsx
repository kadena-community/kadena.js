import { LayoutType } from '../../types';
import { SideMenu } from '../SideMenu';
import { Footer, Header, Menu, MenuBack, Template } from '../';

import { getLayout, isOneOfLayoutType } from '@/utils';
import Head from 'next/head';
import React, { FC, ReactNode, useState } from 'react';

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

export const Main: FC<IProps> = ({ children, markdoc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  let title, description;
  let layoutType = 'default';
  if (markdoc !== undefined) {
    title = markdoc.frontmatter.title;
    description = markdoc.frontmatter.description;
    layoutType = markdoc.frontmatter.layout ?? 'default';
  }

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
  };

  const closeMenu = (): void => setIsMenuOpen(false);

  const Layout = getLayout(layoutType);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Template
        layout={isOneOfLayoutType(Layout, 'landing') ? 'landing' : 'normal'}
      >
        <Header toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          isOpen={isMenuOpen}
          inLayout={
            isOneOfLayoutType(Layout, 'full', 'codeside') ? true : false
          }
        >
          <SideMenu
            closeMenu={closeMenu}
            layout={Layout.displayName as LayoutType}
          />
        </Menu>

        <Layout>{children}</Layout>

        <Footer />
      </Template>
    </>
  );
};
