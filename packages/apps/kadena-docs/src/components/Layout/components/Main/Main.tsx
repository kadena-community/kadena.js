import { HomeHeader } from '../../Landing/components';
import { SideMenu } from '../SideMenu';
import { Footer, Header, Menu, MenuBack, Template, TitleHeader } from '../';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  IMenuItem,
  IPageMeta,
  ISubHeaderElement,
  LayoutType,
} from '@/types/Layout';
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
  frontmatter,
  aSideMenuTree,
  leftMenuTree,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);

  let title, description, subTitle;
  let layoutType: LayoutType = 'full';
  if (frontmatter !== undefined) {
    title = frontmatter.title;
    subTitle = frontmatter.subTitle;
    description = frontmatter.description;
    layoutType = frontmatter.layout ?? 'full';
  }

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
    setIsAsideOpen(false);
  };

  const toggleAside = (): void => {
    setIsAsideOpen((v) => !v);
    setIsMenuOpen(false);
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
        layout={
          isOneOfLayoutType(layoutType, 'landing')
            ? 'landing'
            : isOneOfLayoutType(layoutType, 'code')
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
          layout={layoutType}
        />
        {isOneOfLayoutType(layoutType, 'landing') && title && (
          <TitleHeader title={title} subTitle={subTitle} />
        )}
        {isOneOfLayoutType(layoutType, 'home') && <HomeHeader />}
        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          data-cy="menu"
          isOpen={isMenuOpen}
          inLayout={
            isOneOfLayoutType(layoutType, 'full', 'code', 'codeside', 'landing')
              ? true
              : false
          }
          layout={
            isOneOfLayoutType(layoutType, 'landing') ? 'landing' : 'normal'
          }
        >
          <SideMenu closeMenu={closeMenu} menuItems={leftMenuTree} />
        </Menu>
        <Layout isAsideOpen={isAsideOpen} aSideMenuTree={aSideMenuTree}>
          {isOneOfLayoutType(layoutType, 'full', 'code') && (
            <Breadcrumbs menuItems={leftMenuTree} />
          )}
          {children}
        </Layout>
        <Footer />
      </Template>
    </>
  );
};
