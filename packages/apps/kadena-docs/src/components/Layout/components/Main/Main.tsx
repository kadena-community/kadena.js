import { HomeHeader } from '../../Landing/components';
import { SideMenu } from '../SideMenu';
import { Footer, Header, Menu, MenuBack, Template, TitleHeader } from '../';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { IMenuItem, IPageMeta, ISubHeaderElement } from '@/types/Layout';
import { getLayout, isOneOfLayoutType } from '@/utils';
import Head from 'next/head';
import React, { FC, ReactNode, useState } from 'react';

interface IProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  aSideMenuTree: ISubHeaderElement[];
  frontmatter: IPageMeta;
  leftMenuTree: IMenuItem[];
}

export const Main: FC<IProps> = ({
  children,
  frontmatter: { title, subTitle, description, layout },
  aSideMenuTree,
  leftMenuTree,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
    setIsAsideOpen(false);
  };

  const toggleAside = (): void => {
    setIsAsideOpen((v) => !v);
    setIsMenuOpen(false);
  };

  const closeMenu = (): void => setIsMenuOpen(false);

  const Layout = getLayout(layout);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>

      <Template
        layout={
          isOneOfLayoutType(layout, 'landing')
            ? 'landing'
            : isOneOfLayoutType(layout, 'code')
            ? 'code'
            : 'normal'
        }
      >
        <Header
          toggleMenu={toggleMenu}
          toggleAside={toggleAside}
          isMenuOpen={isMenuOpen}
          isAsideOpen={isAsideOpen}
          menuItems={leftMenuTree}
          layout={layout}
        />
        {isOneOfLayoutType(layout, 'landing') && title && (
          <TitleHeader title={title} subTitle={subTitle} />
        )}
        {isOneOfLayoutType(layout, 'home') && <HomeHeader />}
        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          data-cy="menu"
          isOpen={isMenuOpen}
          inLayout={
            isOneOfLayoutType(layout, 'full', 'code', 'codeside', 'landing')
              ? true
              : false
          }
          layout={isOneOfLayoutType(layout, 'landing') ? 'landing' : 'normal'}
        >
          <SideMenu closeMenu={closeMenu} menuItems={leftMenuTree} />
        </Menu>
        <Layout isAsideOpen={isAsideOpen} aSideMenuTree={aSideMenuTree}>
          {isOneOfLayoutType(layout, 'full', 'code') && (
            <Breadcrumbs menuItems={leftMenuTree} />
          )}
          {children}
        </Layout>
        <Footer />
      </Template>
    </>
  );
};
