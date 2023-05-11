import { HomeHeader } from '../../Landing/components';
import { SideMenu } from '../SideMenu';
import { Footer, Header, Menu, MenuBack, Template, TitleHeader } from '../';

import { getData } from './getData';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { IMenuItem, LayoutType } from '@/types/Layout';
import { getLayout, isOneOfLayoutType } from '@/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useMemo, useState } from 'react';

const typedMenuItems = getData();
interface IProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  frontmatter: {
    title: string;
    subTitle: string;
    description: string;
    layout: LayoutType;
  };
}

export const Main: FC<IProps> = ({ children, frontmatter }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);
  const { pathname } = useRouter();

  /**
   * with every menu change, this will check which menu needs to be opened in the sidemenu
   */
  const menuItems = useMemo(() => {
    const checkSubTreeForActive = (tree: IMenuItem[]): void => {
      if (tree.length) {
        tree.map((item) => {
          // is the menu open?
          console.log(pathname, item.root, pathname.startsWith(item.root));
          if (pathname.startsWith(item.root)) {
            item.isMenuOpen = true;
          } else {
            item.isMenuOpen = false;
          }

          if (item.root === pathname) {
            item.isActive = true;
          } else {
            item.isActive = false;
          }

          // is the actual item active
          if (item.children.length) {
            checkSubTreeForActive(item.children);
          }
        });
      }
    };

    checkSubTreeForActive(typedMenuItems);

    return typedMenuItems;
  }, [pathname]);

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
    setIsAsideOpen(false);
  };

  const toggleAside = (): void => {
    setIsAsideOpen((v) => !v);
    setIsMenuOpen(false);
  };

  const closeMenu = (): void => setIsMenuOpen(false);

  const Layout = getLayout(frontmatter.layout);
  return (
    <>
      <Head>
        <title>{frontmatter.title}</title>
        <meta name="title" content={frontmatter.title} />
        <meta name="description" content={frontmatter.description} />
      </Head>

      <Template
        layout={
          isOneOfLayoutType(frontmatter.layout, 'landing')
            ? 'landing'
            : isOneOfLayoutType(frontmatter.layout, 'code')
            ? 'code'
            : 'normal'
        }
      >
        <Header
          toggleMenu={toggleMenu}
          toggleAside={toggleAside}
          isMenuOpen={isMenuOpen}
          isAsideOpen={isAsideOpen}
          menuItems={menuItems}
          layout={frontmatter.layout}
        />
        {isOneOfLayoutType(frontmatter.layout, 'landing') &&
          frontmatter.title && (
            <TitleHeader
              title={frontmatter.title}
              subTitle={frontmatter.subTitle}
            />
          )}
        {isOneOfLayoutType(frontmatter.layout, 'home') && <HomeHeader />}
        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          data-cy="menu"
          isOpen={isMenuOpen}
          inLayout={
            isOneOfLayoutType(
              frontmatter.layout,
              'full',
              'code',
              'codeside',
              'landing',
            )
              ? true
              : false
          }
          layout={
            isOneOfLayoutType(frontmatter.layout, 'landing')
              ? 'landing'
              : 'normal'
          }
        >
          <SideMenu closeMenu={closeMenu} menuItems={menuItems} />
        </Menu>
        <Layout isAsideOpen={isAsideOpen}>
          {isOneOfLayoutType(frontmatter.layout, 'full', 'code') && (
            <Breadcrumbs menuItems={menuItems} />
          )}
          {children}
        </Layout>
        <Footer />
      </Template>
    </>
  );
};
