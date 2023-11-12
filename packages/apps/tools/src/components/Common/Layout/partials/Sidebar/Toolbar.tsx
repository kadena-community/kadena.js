import { menuData } from '@/constants/side-menu-items';
import { useLayoutContext } from '@/context';
import type { ISidebarSubMenuItem } from '@/types/Layout';
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

export interface IMiniMenuProps {}

export const Toolbar: FC<IMiniMenuProps> = () => {
  const {
    toolbar,
    setActiveMenuIndex,
    activeMenuIndex,
    isMenuOpen,
    visibleLinks,
    setVisibleLinks,
  } = useLayoutContext();
  const router = useRouter();

  const handleItemClick = (index: number): void => {
    setVisibleLinks(false);
    if (toolbar[index]?.items?.length) {
      setActiveMenuIndex(index);
    }
  };

  const handleOpenCloseDrawer = (): void => {
    if (isMenuOpen) {
      setVisibleLinks(false);
      return setActiveMenuIndex(undefined);
    }

    const mainPath = router.pathname.split('/')[1];
    const activeMenu = menuData.find(
      (item) => item.href && item.href.includes(mainPath),
    );

    if (!activeMenu) return;

    const activeMenuIndex = menuData.indexOf(activeMenu);

    setActiveMenuIndex(activeMenuIndex);
  };

  const isMenuActive = (
    item: { title: string; href?: string; items?: ISidebarSubMenuItem[] },
    index: number,
  ) => {
    if (router.pathname === '/') return false;
    const isUrlParam =
      item.href !== undefined &&
      item.href.includes(router.pathname.split('/')[1]);

    return index === activeMenuIndex || isUrlParam;
  };

  const handleLinksClick = (): void => {
    setActiveMenuIndex(-1);
    if (!visibleLinks) {
      setVisibleLinks(true);
    }
  };

  return (
    <nav className={gridItemMiniMenuStyle}>
      <ul className={classNames(gridMiniMenuListStyle)}>
        {toolbar.map((item, index) => (
          <li key={String(item.title)} className={gridMiniMenuListItemStyle}>
            <MenuButton
              {...item}
              href={'#'}
              onClick={() => handleItemClick(index)}
              active={isMenuActive(item, index)}
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
              href={'#'}
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
              href={'#'}
              icon={'ArrowExpandUp'}
              onClick={() => handleOpenCloseDrawer()}
            />
          </div>
        </li>
      </ul>
    </nav>
  );
};
