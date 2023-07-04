import { SideMenu } from '../SideMenu';
import { Footer, Header, Menu, MenuBack, Template, TitleHeader } from '../';

import { LastModifiedDate } from '@/components';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { IPageProps } from '@/types/Layout';
import { getLayout, isOneOfLayoutType } from '@/utils';
import Head from 'next/head';
import React, { FC, useState } from 'react';

export const Main: FC<IPageProps> = ({
  children,
  frontmatter: {
    title = '',
    subTitle = '',
    description = '',
    layout: layoutType,
    lastModifiedDate,
    icon: pageIcon,
    editLink,
    navigation,
  },
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
          <TitleHeader title={title} subTitle={subTitle} icon={pageIcon} />
        )}

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
        <Layout
          isAsideOpen={isAsideOpen}
          aSideMenuTree={aSideMenuTree}
          editLink={editLink}
          navigation={navigation}
        >
          {isOneOfLayoutType(layoutType, 'full', 'code') && (
            <>
              <Breadcrumbs menuItems={leftMenuTree} />
              <LastModifiedDate date={lastModifiedDate} />
            </>
          )}
          {children}
        </Layout>
        <Footer />
      </Template>
    </>
  );
};
