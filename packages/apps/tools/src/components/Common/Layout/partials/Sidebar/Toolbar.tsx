import { menuData } from '@/constants/side-menu-items';
import { useLayoutContext } from '@/context';
import type { ISidebarSubMenuItem } from '@/types/Layout';
import { getHref } from '@/utils/getHref';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { MenuButton } from './MenuButton';
import {
  bottomIconsContainerStyle,
  gridItemMiniMenuStyle,
  gridMiniMenuListItemStyle,
  gridMiniMenuListStyle,
} from './styles.css';

export const Toolbar: FC = () => {
  const {
    toolbar,
    setActiveMenuIndex,
    activeMenuIndex,
    isMenuOpen,
    visibleLinks,
    setVisibleLinks,
    setIsMenuOpen,
  } = useLayoutContext();
  const { pathname } = useRouter();

  const handleItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ): void => {
    event.preventDefault();

    setVisibleLinks(false);
    if (toolbar[index]?.items?.length) {
      setActiveMenuIndex(index);
      setIsMenuOpen(true);
    }
  };

  const handleOpenDrawer = (): void => {
    if (isMenuOpen) {
      setVisibleLinks(false);
      setIsMenuOpen(false);
      return setActiveMenuIndex(undefined);
    }

    const mainPath = pathname.split('/')[1];
    const activeMenu = menuData.find(
      (item) => item.href && item.href.includes(mainPath),
    );

    if (!activeMenu) return;

    const activeMenuIndex = menuData.indexOf(activeMenu);

    setActiveMenuIndex(activeMenuIndex);
    setIsMenuOpen(true);
  };

  const isMenuActive = (
    item: { title: string; href?: string; items?: ISidebarSubMenuItem[] },
    index: number,
  ) => {
    if (pathname === '/') return false;
    const isUrlParam =
      item.href !== undefined && item.href.includes(pathname.split('/')[1]);

    return index === activeMenuIndex || isUrlParam;
  };

  const handleLinksClick = (): void => {
    setActiveMenuIndex(-1);
    if (!visibleLinks) {
      setVisibleLinks(true);
      setIsMenuOpen(true);
    }
  };

  return (
    <nav className={gridItemMiniMenuStyle}>
      <ul className={classNames(gridMiniMenuListStyle)}>
        {toolbar.map((item, index) => (
          <li key={String(item.title)} className={gridMiniMenuListItemStyle}>
            <MenuButton
              {...item}
              onClick={(e) => handleItemClick(e, index)}
              active={isMenuActive(item, index)}
              href={getHref(pathname, item.href)}
            />
          </li>
        ))}
      </ul>
      <ul
        className={classNames(gridMiniMenuListStyle, bottomIconsContainerStyle)}
      >
        <li key={String('links')} className={gridMiniMenuListItemStyle}>
          <div>
            <MenuButton
              title={'Links'}
              icon={'Link'}
              onClick={() => handleLinksClick()}
              active={visibleLinks}
            />
          </div>
        </li>
        <li key={String('openDrawer')} className={gridMiniMenuListItemStyle}>
          <div>
            <MenuButton
              rotateClass={isMenuOpen ? 'left' : 'right'}
              title={isMenuOpen ? 'Close' : 'Open'}
              icon={'ArrowExpandUp'}
              onClick={handleOpenDrawer}
            />
          </div>
        </li>
      </ul>
    </nav>
  );
};
