import { Heading } from '@kadena/react-components';

import {
  Article,
  Aside,
  AsideBackground,
  AsideLink,
  AsideList,
  Content,
  StickyAside,
  StickyAsideWrapper,
} from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout, ISubHeaderElement } from '@/types/Layout';
import { createSlug } from '@/utils';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

export const Full: FC<ILayout> = ({ children, aSideMenuTree = [] }) => {
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const [activeItem, setActiveItem] = useState();
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isIntersecting, setIsIntersecting] = useState(false);

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    const { target, isIntersecting, intersectionRatio } = entry;

    const menuItem = menuRef.current.querySelector(
      `a[href="${
        window.location.pathname + entry.target.getAttribute('href')
      }"]`,
    );

    if (!menuItem) return;

    console.log(menuItem);
    if (isIntersecting) {
      setActiveItem(entry.target.getAttribute('href'));
    } else {
    }
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(updateEntry, {
      threshold: 1,
    });

    const headings = scrollRef.current.querySelectorAll(
      'h1 > a, h2 > a, h3 > a, h4 > a, h5 > a, h6 > a',
    );

    Array.from(headings).map((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [scrollRef.current, menuRef.current]);

  const renderListItem = (item: ISubHeaderElement): ReactNode => {
    if (item.title === undefined) return null;

    const slug = `#${createSlug(item.title)}`;

    console.log(slug, activeItem);
    return (
      <AsideLink
        href={slug}
        key={slug}
        label={item.title}
        isActive={activeItem === slug}
      >
        {item.children.length > 0 && (
          <AsideList inner={true}>
            {item.children.map(renderListItem)}
          </AsideList>
        )}
      </AsideLink>
    );
  };

  return (
    <>
      <Content id="maincontent">
        <Article ref={scrollRef}>
          {children}

          <BottomPageSection />
        </Article>
      </Content>

      <AsideBackground />
      <Aside data-cy="aside">
        {aSideMenuTree.length > 0 && (
          <StickyAsideWrapper>
            <StickyAside>
              1{activeItem}1
              <Heading as="h6" transform="uppercase">
                On this page
              </Heading>
              <AsideList ref={menuRef}>
                {aSideMenuTree.map(renderListItem)}
              </AsideList>
            </StickyAside>
          </StickyAsideWrapper>
        )}
      </Aside>
    </>
  );
};

Full.displayName = 'Full';
