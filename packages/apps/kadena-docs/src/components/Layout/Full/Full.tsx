import { Heading } from '@kadena/react-components';

import {
  Article,
  Aside,
  AsideBackground,
  AsideList,
  Content,
  ListItem,
  StickyAside,
  StickyAsideWrapper,
} from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout } from '@/types/Layout';
import { createSlug } from '@/utils';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useRef, useState } from 'react';

export const Full: FC<ILayout> = ({
  children,
  aSideMenuTree = [],
  editLink,
  navigation,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLUListElement | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');

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

  return (
    <>
      <Content id="maincontent">
        <Article ref={scrollRef}>
          {children}
          <BottomPageSection editLink={editLink} navigation={navigation} />
        </Article>
      </Content>
      <AsideBackground />
      <Aside data-cy="aside">
        {aSideMenuTree.length > 0 && (
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
    </>
  );
};

Full.displayName = 'Full';
