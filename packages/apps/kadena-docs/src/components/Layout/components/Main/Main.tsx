import { SideMenu } from '../SideMenu';
import { Footer, Header, Menu, MenuBack, Template, TitleHeader } from '../';

import importedMenu from '@/data/menu.json';
import { IMenuItem, LayoutType } from '@/types/Layout';
import { getLayout, isOneOfLayoutType } from '@/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useMemo, useState } from 'react';

const typedMenuItems: IMenuItem[] = importedMenu as IMenuItem[];
interface IProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  markdoc: {
    frontmatter: {
      title: string;
      subTitle: string;
      description: string;
      layout: LayoutType;
    };
  };
}

export const Main: FC<IProps> = ({ children, markdoc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { pathname } = useRouter();

  /**
   * with every menu change, this will check which menu needs to be opened in the sidemenu
   */
  const menuItems = useMemo(() => {
    const checkSubTreeForActive = (tree: IMenuItem[]): void => {
      if (tree.length) {
        tree.map((item) => {
          // is the menu open?
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

  let title, description, subTitle;
  let layoutType = 'default';
  if (markdoc !== undefined) {
    title = markdoc.frontmatter.title;
    subTitle = markdoc.frontmatter.subTitle;
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
        <Header
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          menuItems={menuItems}
        />
        {layoutType === 'landing' && title && (
          <TitleHeader title={title} subTitle={subTitle} />
        )}

        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          isOpen={isMenuOpen}
          inLayout={
            isOneOfLayoutType(Layout, 'full', 'codeside') ? true : false
          }
        >
          <SideMenu closeMenu={closeMenu} menuItems={menuItems} />
        </Menu>

        <Layout>{children}</Layout>

        <Footer />
      </Template>
    </>
  );
};
