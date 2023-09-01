import { Heading } from '@kadena/react-ui';

import { basebackgroundClass } from '../basestyles.css';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '../components';
import { Template } from '../components/Template';
import { globalClass } from '../global.css';

import {
  Aside,
  AsideList,
  ListItem,
  StickyAside,
  StickyAsideWrapper,
} from './components/Aside';
import { PageGrid } from './styles';
import { asidebackgroundClass } from './styles.css';

import { BottomPageSection } from '@/components/BottomPageSection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LastModifiedDate } from '@/components/LastModifiedDate';
import { IPageProps } from '@/types/Layout';
import { createSlug } from '@/utils';
import classnames from 'classnames';
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
  const contentClassNames = classnames(
    contentClass,
    contentClassVariants[frontmatter.layout] ?? '',
  );

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

  const backgroundClassnames = classnames(
    basebackgroundClass,
    asidebackgroundClass,
  );

  return (
    <PageGrid className={globalClass}>
      <Template menuItems={leftMenuTree}>
        <div className={contentClassNames} id="maincontent">
          <article className={articleClass} ref={scrollRef}>
            <Breadcrumbs menuItems={leftMenuTree} />
            <LastModifiedDate date={frontmatter.lastModifiedDate} />
            {children}
            <BottomPageSection
              editLink={frontmatter.editLink}
              navigation={frontmatter.navigation}
            />
          </article>
        </div>
        <div className={backgroundClassnames} />
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
      </Template>
    </PageGrid>
  );
};

Full.displayName = 'Full';
