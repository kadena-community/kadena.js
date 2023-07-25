import {
  Article,
  Content,
  Footer,
  Header,
  Menu,
  MenuBack,
  TitleHeader,
} from '../components';
import { SideMenu } from '../components/SideMenu';

import { Template } from './styles';

import { NotFound } from '@/components/NotFound';
import { IPageProps } from '@/types/Layout';
import Head from 'next/head';
import React, { FC, useState } from 'react';

export const Landing: FC<IPageProps> = ({
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
        />

        <TitleHeader
          title={frontmatter.title}
          subTitle={frontmatter.subTitle}
          icon={frontmatter.icon}
        />

        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu
          data-cy="menu"
          isOpen={isMenuOpen}
          inLayout={true}
          layout={'landing'}
        >
          <SideMenu closeMenu={closeMenu} menuItems={leftMenuTree} />
        </Menu>

        <Content id="maincontent" layout="code">
          <Article>
            {children}

            <NotFound />
          </Article>
        </Content>
        <Footer />
      </Template>
    </>
  );
};

Landing.displayName = 'Landing';
