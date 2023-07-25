import {
  Article,
  CodeBackground,
  Content,
  Footer,
  Header,
  Menu,
  MenuBack,
} from '../components';
import { SideMenu } from '../components/SideMenu';

import { Template } from './styles';

import { BottomPageSection } from '@/components/BottomPageSection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LastModifiedDate } from '@/components/LastModifiedDate';
import { IPageProps } from '@/types/Layout';
import Head from 'next/head';
import React, { FC, useState } from 'react';
import { RedocRawOptions } from 'redoc';

export const options: RedocRawOptions = {
  pathInMiddlePanel: true,
  disableSearch: true,
  hideDownloadButton: true,
  hideFab: true,

  theme: {
    breakpoints: {
      small: '1024px',
      medium: '1280px',
      large: '1440px',
    },
    sidebar: {
      backgroundColor: 'transparent',
    },

    rightPanel: {
      backgroundColor: 'transparent',
      width: '400px',
    },
    codeBlock: {
      backgroundColor: 'black',
    },
    colors: {
      primary: {
        main: 'RGB(218,52,140)', // Kadena pink
      },
    },
  },
  expandResponses: '200,201,204',
};

export const Redocly: FC<IPageProps> = ({
  children,
  frontmatter,
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

  return (
    <>
      <Head>
        <title>{frontmatter.title}</title>
        <meta name="title" content={frontmatter.title} />
        <meta name="description" content={frontmatter.description} />
      </Head>
      <Template>
        <Header
          toggleMenu={toggleMenu}
          toggleAside={toggleAside}
          isMenuOpen={isMenuOpen}
          isAsideOpen={isAsideOpen}
          menuItems={leftMenuTree}
          layout="code"
        />
        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          data-cy="menu"
          isOpen={isMenuOpen}
          inLayout={true}
          layout="normal"
        >
          <SideMenu closeMenu={closeMenu} menuItems={leftMenuTree} />
        </Menu>

        <Content id="maincontent" layout="code">
          <Article>
            <Breadcrumbs menuItems={leftMenuTree} />
            <LastModifiedDate date={frontmatter.lastModifiedDate} />
            {children}
            <BottomPageSection
              editLink={frontmatter.editLink}
              navigation={frontmatter.navigation}
              layout="code"
            />
          </Article>
        </Content>
        <CodeBackground isOpen={isAsideOpen} />
        <Footer />
      </Template>
    </>
  );
};

Redocly.displayName = 'Redocly';
