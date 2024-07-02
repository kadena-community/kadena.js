import { BottomPageSection } from '@/components/BottomPageSection/BottomPageSection';
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs';
import { TopPageSection } from '@/components/TopPageSection/TopPageSection';
import type { IPageProps, ISubHeaderElement } from '@kadena/docs-tools';
import { Heading } from '@kadena/kode-ui';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template/Template';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '../components/articleStyles.css';
import { globalClass } from '../global.css';
import { BackgroundGradient } from './BackgroundGradient';
import { AsideList, ListItem } from './components/Aside';
import {
  asideClass,
  pageGridClass,
  stickyAsideClass,
  stickyAsideWrapperClass,
} from './styles.css';

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

  const gridClassNames = classnames(globalClass, baseGridClass, pageGridClass);

  return (
    <div className={gridClassNames}>
      <Template menuItems={leftMenuTree}>
        <div className={contentClassNames} id="maincontent">
          <article className={articleClass} ref={scrollRef}>
            <Breadcrumbs menuItems={leftMenuTree} />
            <TopPageSection
              lastModifiedDate={frontmatter.lastModifiedDate}
              editLink={frontmatter.editLink}
            />
            {children}
            <BottomPageSection
              editLink={frontmatter.editLink}
              navigation={frontmatter.navigation}
            />
          </article>
        </div>
        <BackgroundGradient />
        <aside className={asideClass} data-cy="aside">
          {showSideMenu && (
            <div className={stickyAsideWrapperClass}>
              <div className={stickyAsideClass}>
                <Heading as="h6" transform="uppercase">
                  On this page
                </Heading>
                <AsideList ref={menuRef}>
                  {aSideMenuTree.map((innerItem: ISubHeaderElement) => {
                    const innerSlug = innerItem.slug;
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
              </div>
            </div>
          )}
        </aside>
      </Template>
    </div>
  );
};

Full.displayName = 'Full';
