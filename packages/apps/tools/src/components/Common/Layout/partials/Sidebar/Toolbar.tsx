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
  iconLeftStyle,
  iconRightStyle,
} from './styles.css';

export interface IMiniMenuProps {}

export const Toolbar: FC<IMiniMenuProps> = () => {
  const { toolbar, setActiveMenuIndex, activeMenuIndex, isMenuOpen } =
    useLayoutContext();
  const router = useRouter();

  const handleItemClick = (index: number): void => {
    if (toolbar[index]?.items?.length) {
      setActiveMenuIndex(index);
    }
  };

  const handleOpenCloseDrawer = (): void => {
    if (isMenuOpen) {
      return setActiveMenuIndex(undefined);
    }

    const mainPath = router.pathname.split('/')[1];
    const activeMenu = menuData.find((item) => item.href.includes(mainPath));

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
        <li
          key={String('openDrawer')}
          className={classNames(
            gridMiniMenuListItemStyle,
            isMenuOpen ? iconLeftStyle : iconRightStyle,
          )}
        >
          <MenuButton
            title={'Drawer'}
            href={'#'}
            icon={'ArrowExpandUp'}
            onClick={() => handleOpenCloseDrawer()}
          />
        </li>
      </ul>
    </nav>
  );
};
