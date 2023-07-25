import { Heading } from '@kadena/react-ui';

import {
  Article,
  Aside,
  AsideBackground,
  AsideList,
  Content,
  Footer,
  Header,
  ListItem,
  Menu,
  MenuBack,
  StickyAside,
  StickyAsideWrapper,
} from '../components';
import { SideMenu } from '../components/SideMenu';

import { Template } from './styles';

import { BottomPageSection } from '@/components/BottomPageSection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LastModifiedDate } from '@/components/LastModifiedDate';
import { IPageProps } from '@/types/Layout';
import { createSlug } from '@/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useRef, useState } from 'react';

export const Full: FC<IPageProps> = ({
  children,
  aSideMenuTree = [],
  frontmatter,
  leftMenuTree,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLUListElement | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');
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

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    const { isIntersecting } = entry;

    if (isIntersecting) {
      setActiveItem(entry.target.getAttribute('href') ?? '');
    }
  };

  useEffect(() => {
    if (activeItem === null) {
      const [, hash] = router.asPath.split('#');
      const hashPath = hash ? `#${hash}` : '';

      setActiveItem(hashPath);
    }

    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(updateEntry, {
      rootMargin: '20% 0% -65% 0px',
    });

    const headings = scrollRef.current.querySelectorAll(
      'h1 > a, h2 > a, h3 > a, h4 > a, h5 > a, h6 > a',
    );

    Array.from(headings).map((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [activeItem, router.asPath]);

  const showSideMenu: boolean =
    aSideMenuTree.length > 1 || aSideMenuTree[0]?.children.length > 0;

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
        <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
        <Menu data-cy="menu" isOpen={isMenuOpen} inLayout={true}>
          <SideMenu closeMenu={closeMenu} menuItems={leftMenuTree} />
        </Menu>

        <Content id="maincontent">
          <Article ref={scrollRef}>
            <Breadcrumbs menuItems={leftMenuTree} />
            <LastModifiedDate date={frontmatter.lastModifiedDate} />
            {children}
            <BottomPageSection
              editLink={frontmatter.editLink}
              navigation={frontmatter.navigation}
            />
          </Article>
        </Content>
        <AsideBackground />
        <Aside data-cy="aside">
          {showSideMenu && (
            <StickyAsideWrapper>
              <StickyAside>
                <Heading as="h6" transform="uppercase">
                  On this page
                </Heading>
                <AsideList ref={menuRef}>
                  {aSideMenuTree.map((innerItem) => {
                    const innerSlug = createSlug(innerItem.title);
                    return (
                      <ListItem
                        key={innerSlug}
                        scrollArea={scrollRef.current}
                        item={innerItem}
                        activeItem={activeItem}
                        setActiveItem={setActiveItem}
                      />
                    );
                  })}
                </AsideList>
              </StickyAside>
            </StickyAsideWrapper>
          )}
        </Aside>
        <Footer />
      </Template>
    </>
  );
};

Full.displayName = 'Full';
